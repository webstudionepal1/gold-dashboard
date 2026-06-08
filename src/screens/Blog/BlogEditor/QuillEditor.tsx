"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const DEFAULT_MODULES = {
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
};

const DEFAULT_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
  "image",
  "video",
  "blockquote",
  "code-block",
];

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const onChangeRef = useRef(onChange);
  const isInternalChange = useRef(false);
  const initialValueRef = useRef(value);

  onChangeRef.current = onChange;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || quillRef.current) return;

    // Quill inserts `.ql-toolbar` as a sibling before the editor node, not inside it.
    // Clear the whole wrapper so Strict Mode remounts don't leave duplicate toolbars.
    wrapper.innerHTML = "";
    const editorNode = document.createElement("div");
    wrapper.appendChild(editorNode);

    const quill = new Quill(editorNode, {
      theme: "snow",
      placeholder,
      modules: modules ?? DEFAULT_MODULES,
      formats: formats ?? DEFAULT_FORMATS,
    });

    const initialValue = initialValueRef.current;
    if (initialValue && initialValue !== "<p><br></p>") {
      quill.clipboard.dangerouslyPasteHTML(initialValue);
    }

    quill.on("text-change", () => {
      isInternalChange.current = true;
      onChangeRef.current(quill.root.innerHTML);
    });

    quillRef.current = quill;

    return () => {
      quillRef.current = null;
      wrapper.innerHTML = "";
    };
    // Mount once; wrapper cleanup removes toolbar + editor together.
  }, []);

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
      ref={wrapperRef}
      className="blog-quill-editor overflow-hidden max-w-full"
      style={{ minHeight }}
    />
  );
};

export default QuillEditor;
