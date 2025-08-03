declare module "react-quill" {
  import { Component } from "react";

  export interface QuillModules {
    toolbar?: any;
    [key: string]: any;
  }

  export interface ReactQuillProps {
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    readOnly?: boolean;
    modules?: QuillModules;
    formats?: string[];
    bounds?: string | HTMLElement;
    theme?: string;
    style?: React.CSSProperties;
    className?: string;
    onChange?: (content: string, delta: any, source: string, editor: any) => void;
    onChangeSelection?: (selection: any, source: string, editor: any) => void;
    onFocus?: (selection: any, source: string, editor: any) => void;
    onBlur?: (previousSelection: any, source: string, editor: any) => void;
    onKeyPress?: (event: React.KeyboardEvent) => void;
    onKeyDown?: (event: React.KeyboardEvent) => void;
    onKeyUp?: (event: React.KeyboardEvent) => void;
    preserveWhitespace?: boolean;
    tabIndex?: number;
  }

  export default class ReactQuill extends Component<ReactQuillProps> {}
}

declare module "react-quill/dist/quill.snow.css";
