import { t } from "../../utils/t";
import { translateAiText } from "../../utils/convert";

export default function BasicReport({ lang, data }) {
  const tr = t(lang);

  const text = translateAiText(data.basicAi?.text || "", lang);

  return (
    <div className="p-4 bg-white rounded shadow my-4">
      <h2 className="text-xl font-bold mb-4">{tr.basicTitle}</h2>
      <pre className="whitespace-pre-wrap">{text}</pre>
    </div>
  );
}
