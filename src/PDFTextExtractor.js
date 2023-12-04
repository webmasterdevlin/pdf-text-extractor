import React, { useState } from "react";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const PDFTextExtractor = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result);

        const loadingTask = pdfjs.getDocument({ data: typedArray });
        const pdf = await loadingTask.promise;

        let extractedText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          textContent.items.forEach(
            (item) => (extractedText += item.str + " ")
          );
        }
        setText(extractedText);
      };

      fileReader.readAsArrayBuffer(file);
      setFile(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <input type="file" onChange={onFileChange} />
      {file && (
        <iframe
          src={file}
          title="PDF Preview"
          width="500"
          height="600"
        ></iframe>
      )}
      <div>
        <h3>Extracted Text:</h3>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default PDFTextExtractor;
