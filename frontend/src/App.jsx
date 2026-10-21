
import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [task, setTask] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState([]);

  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState("");

  const exampleTasks = [
    "Create a 7-day study plan for DSA.",
    "Explain recursion in simple words with an example.",
    "Help me write a professional email to my professor.",
    "Create a professional LinkedIn headline for a computer engineering student.",
    "Help me prepare for placement interviews in 7 days."
  ];

  const runAgent = async () => {
    if (!task.trim()) {
      setResult("Please enter a task first.");
      return;
    }

    setLoading(true);
    setResult("");
    setChecklist([]);
    setFileError("");

    try {
      const response = await fetch(`${API_URL}/run-agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ task })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "The AI Agent could not complete your task.");
      }

      const answer = data.result || "No response received.";
      setResult(answer);

      const steps = answer
        .split("\n")
        .map((line) => line.trim())
        .filter((line) =>
          /^(\d+[\.)]\s+|\*\*Day\s+\d+|[-*]\s+)/i.test(line)
        )
        .map((line) =>
          line
            .replace(/^\d+[\.)]\s+/, "")
            .replace(/^[-*]\s+/, "")
            .replace(/\*\*/g, "")
            .trim()
        )
        .filter((line) => line.length > 2)
        .slice(0, 20);

      setChecklist(
        steps.map((text, index) => ({
          id: index,
          text,
          completed: false
        }))
      );
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const analyzeFile = async () => {
    if (!file) {
      setFileError("Please select a PDF or TXT file first.");
      return;
    }

    if (!question.trim()) {
      setFileError("Please enter a question about your document.");
      return;
    }

    setFileLoading(true);
    setFileError("");
    setResult("");
    setChecklist([]);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("question", question);

      const response = await fetch(`${API_URL}/analyze-file`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Document analysis failed.");
      }

      setResult(
        `Document: ${data.filename}\n\n${data.result}` +
        (data.text_truncated
          ? "\n\nNote: Only part of the document was analyzed because it exceeded the text limit."
          : "")
      );
    } catch (error) {
      setFileError(
        `Could not analyze the document: ${error.message}`
      );
    } finally {
      setFileLoading(false);
    }
  };

  const toggleChecklistItem = (id) => {
    setChecklist((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const clearAll = () => {
    setTask("");
    setResult("");
    setChecklist([]);
    setFile(null);
    setQuestion("");
    setFileError("");

    const input = document.getElementById("document-file");
    if (input) input.value = "";
  };

  const completedCount = checklist.filter(
    (item) => item.completed
  ).length;

  const busy = loading || fileLoading;

  return (
    <div className="app">
      <header>
        <h1>🤖 AI Personal Agent</h1>
        <p className="subtitle">
          Your intelligent assistant for study, coding, career and everyday tasks
        </p>
      </header>

      <div className="input-section">
        <h2>💬 What can I help you with?</h2>

        <textarea
          placeholder="Tell your AI Agent what you want it to do..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          disabled={busy}
        />

        <button onClick={runAgent} disabled={busy}>
          {loading ? "🤖 Agent is thinking..." : "✨ Run AI Agent"}
        </button>

        <div className="examples">
          <p>💡 Try an example:</p>

          {exampleTasks.map((example, index) => (
            <button
              key={index}
              className="example-button"
              onClick={() => setTask(example)}
              disabled={busy}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div className="input-section document-section">
        <h2>📄 Ask Questions About a Document</h2>
        <p>
          Upload a PDF or TXT file and let your local AI model
          summarize it, explain concepts, or answer questions.
        </p>

        <label htmlFor="document-file">
          Choose a PDF or TXT file (maximum 10 MB)
        </label>

        <input
          id="document-file"
          type="file"
          accept=".pdf,.txt,application/pdf,text/plain"
          disabled={busy}
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setFileError("");
          }}
        />

        {file && (
          <p>
            Selected file: <strong>{file.name}</strong>
          </p>
        )}

        <textarea
          placeholder="Example: Summarize this document in 5 simple bullet points."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={busy}
        />

        <button onClick={analyzeFile} disabled={busy}>
          {fileLoading ? "📖 Analyzing document..." : "🔍 Analyze Document"}
        </button>

        {fileError && (
          <p role="alert" className="file-error">
            {fileError}
          </p>
        )}
      </div>

      <div className="result">
        <h2>✨ Agent Result</h2>

        {busy ? (
          <p>
            ⏳ Your AI Agent is working on your request...
          </p>
        ) : result ? (
          <div className="result-content">
            <pre className="result-text">{result}</pre>
          </div>
        ) : (
          <p className="empty-result">
            Your AI Agent's response will appear here.
          </p>
        )}
      </div>

      {checklist.length > 0 && (
        <div className="checklist-section">
          <h2>✅ Your Action Checklist</h2>

          <p>
            Progress: {completedCount} of {checklist.length} tasks completed
          </p>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${(completedCount / checklist.length) * 100}%`
              }}
            />
          </div>

          {checklist.map((item) => (
            <label className="checklist-item" key={item.id}>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleChecklistItem(item.id)}
              />
              <span
                className={item.completed ? "completed-task" : ""}
              >
                {item.text}
              </span>
            </label>
          ))}
        </div>
      )}

      <div className="clear-section">
        <button
          className="clear-button"
          onClick={clearAll}
          disabled={busy}
        >
          Clear Everything
        </button>
      </div>
    </div>
  );
}

export default App;
