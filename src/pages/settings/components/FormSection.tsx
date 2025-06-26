import React from "react";
import Field, { FieldProps } from "./Field";

interface Props {
  heading: string;
  inputs: (FieldProps & { width?: string })[];
  className?: string;
}

const FormSection: React.FC<Props> = ({ heading, inputs, className }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-slate-800 mb-2">{heading}</h2>
      <hr />
      <div className={`grid gap-4 mt-3 ${className}`}>
        {inputs.map((input, idx) => (
          <div key={idx} className={input.width ? input.width : "col-span-1"}>
            <Field {...input} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormSection;
