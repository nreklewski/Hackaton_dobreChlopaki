import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

type ServiceItem = {
  id: number;
  name: string;
  description: string;
  category: string;
  tags: string[];
};

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, services } = body as {
      query: string;
      services: ServiceItem[];
    };

    if (!query || !Array.isArray(services)) {
      return NextResponse.json(
        { error: "Missing query or services" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const systemPrompt =
      "Jesteś asystentem, który dopasowuje usługi do problemu użytkownika na podstawie TAGÓW. " +
      "Twoim zadaniem jest policzenie podobieństwa każdego punktu do zapytania (0–100%) i zwrócenie tylko tych punktów, które naprawdę pasują. " +
      "Jeśli zapytanie dotyczy samochodu/auta (np. 'auto', 'samochód', 'bateria w aucie', 'tesla'), NIE zwracaj usług rowerowych lub ogólnych, które nie są jasno związane z samochodami. " +
      "Jeśli zapytanie dotyczy ładowania samochodu elektrycznego, preferuj punkty ładowania, a dopiero potem serwisy. " +
      "Usługi rowerowe traktuj osobno od samochodowych – 'rower' i 'auto' to różne kategorie. " +
      "Lepiej zwrócić pustą listę niż przypadkowe wyniki.";

    const servicesDescription = services
      .map(
        (s) =>
          `ID: ${s.id}\nNazwa: ${s.name}\nKategoria: ${s.category}\nOpis: ${s.description}\nTagi: ${s.tags.join(
            ", "
          )}`
      )
      .join("\n\n");

    const userPrompt = `Zapytanie użytkownika: "${query}".

Masz następujące usługi:

${servicesDescription}

Zwróć JSON z jednym polem "items", które jest tablicą obiektów { "id": number, "score": number }.
Pole "score" to Twoja ocena dopasowania w procentach (0–100). Posortuj "items" malejąco po "score".
Jeśli usługa nie pasuje, nadaj jej niski wynik (<30). Nie dodawaj żadnego innego tekstu.`;

    // Używamy gemini-pro jako stabilnego modelu
    // Alternatywnie można użyć: "gemini-1.5-pro", "gemini-1.5-flash-latest"
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPrompt, {
      temperature: 0,
    });

    const response = result.response;
    let rawText = response.text() ?? "";

    // Spróbuj wyciągnąć czystego JSON-a nawet jeśli model dodał komentarz lub ```
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      rawText = jsonMatch[0];
    }

    let ids: number[] = [];
    try {
      const parsed = JSON.parse(rawText || "{}") as {
        items?: { id: number; score: number }[];
      };
      if (Array.isArray(parsed.items)) {
        // próg dopasowania, np. 40%
        const THRESHOLD = 40;
        ids = parsed.items
          .filter(
            (item) =>
              typeof item.id === "number" &&
              typeof item.score === "number" &&
              item.score >= THRESHOLD
          )
          .map((item) => item.id);
      }
    } catch {
      ids = [];
    }

    return NextResponse.json({ ids });
  } catch (error: unknown) {
    console.error("Error in /api/uslugi-match:", error);
    const message =
      typeof error === "object" && error && "message" in error
        ? String((error as { message?: string }).message)
        : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}