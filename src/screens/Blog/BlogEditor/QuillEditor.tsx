"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  modules?: Record<string, unknown>;
  formats?: string[];
  minHeight?: number;
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  placeholder,
  modules,
  formats,
  minHeight = 280,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const onChangeRef = useRef(onChange);
  const isInternalChange = useRef(false);

  onChangeRef.current = onChange;

  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    const quill = new Quill(containerRef.current, {
      theme: "snow",
      placeholder,
      modules: modules ?? {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["blockquote", "code-block"],
          ["clean"],
        ],
      },
      formats,
    });

    if (value) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }

    quill.on("text-change", () => {
      isInternalChange.current = true;
      onChangeRef.current(quill.root.innerHTML);
    });

    quillRef.current = quill;

    return () => {
      quillRef.current = null;
    };
  }, [formats, modules, placeholder]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill || isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    const currentHtml = quill.root.innerHTML;
    if (currentHtml !== value) {
      if (!value || value === "<p><br></p>") {
        quill.setText("");
      } else {
        quill.clipboard.dangerouslyPasteHTML(value);
      }
    }
  }, [value]);

  return (
    <div
      className="blog-quill-editor overflow-hidden max-w-full"
      style={{ minHeight }}
    >
      <div ref={containerRef} />
    </div>
  );
};

export default QuillEditor;
