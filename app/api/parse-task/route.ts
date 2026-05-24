import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // automatically uses ANTHROPIC_API_KEY

export async function POST(request:Request) {
    try {
        const { text } = await request.json();
        const todaysDate = new Date().toISOString().split("T")[0];

        // prompt
        const prompt = `The following is text copied and pasted from a user's notification or message.
        Parse the text into a todo task using the following schema.
        Speficy null for any field that can't be inferred.
        The response should be in JSON only - no prose, no markdown, no backticks, no code fences.
        Today's date is ${todaysDate}.

        ## Fields
        | Name | Type | Constraints |
        |------|------|-------------|
        | title | text | required |
        | status | text |  Not Started, In Progress, Responded, Waiting, Done - Default to Not Started |
        | priority | text | Low, Medium, High - infer urgency from text but otherwise default to Medium |
        | contact | text |  Nullable |
        | due_date | date |  Nullable - YYYY-MM-DD format |
        | notes | text |  Nullable |`
        
        // send the text to Claude
        const message = await client.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1024,
            messages: [
                { role: "user", content: `${prompt}\n\n${text}` }
            ]
        });

        // extract the text response and parse as JSON
        const content = message.content[0];
        if (content.type !== "text") {
            return Response.json({error: "Unexpected response type" }, { status: 500 });
        }
        const rawText = content.text
            .replace(/^```json\n?/, "")
            .replace(/^```\n?/, "")
            .replace(/\n?```$/, "")
            .trim();

        const parsed = JSON.parse(rawText);

        // return it to the browser
        return Response.json(parsed);
    } catch (error) {
        console.error("parse-task error:", error);
        return Response.json({ error: String(error) }, { status: 500 });
    }
}