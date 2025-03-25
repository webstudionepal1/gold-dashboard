import classname from "classnames";
import React from "react";

type HTMLTags =
  | "p"
  | "div"
  | "span"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "section"
  | "article"
  | "header"
  | "footer"
  | "aside";

interface propTypes
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {
  as?: HTMLTags;
  children: React.ReactNode;
  size?:
    | "heading-lg-sm"
    | "heading-lg-mid"
    | "heading-lg-default"
    | "heading-lg-lg"
    | "heading-lg-rare"
    | "body-lg-sm"
    | "body-lg-mid"
    | "body-lg-default"
    | "body-lg-lg"
    | "body-lg-rare"
    | "body-md-sm"
    | "body-md-mid"
    | "body-md-default"
    | "body-md-lg"
    | "body-md-rare"
    | "body-base-sm"
    | "body-base-mid"
    | "body-base-default"
    | "body-base-lg"
    | "body-base-rare"
    | "body-sm-sm"
    | "body-sm-mid"
    | "body-sm-default"
    | "body-sm-lg"
    | "body-sm-rare"
    | "body-xm-sm"
    | "body-xm-mid"
    | "body-xm-default"
    | "body-xm-lg"
    | "body-xm-rare"
    | "body-xs-sm"
    | "body-xs-mid"
    | "body-xs-default"
    | "body-xs-lg"
    | "body-xs-rare";

  variant?:
    | "default"
    | "fade-black"
    | "white"
    | "grey"
    | "border"
    | "yellow"
    | "lynch-400"
    | "lynch-900"
    | "silver-500"
    | "silver-600"
    | "silver-950"
    | "fade-white"
    | "primary-blue"
    | "fadish-black"
    | "grey-300"
    | "grey-600"
    | "grey-400"
    | "grey-500"
    | "lime-green"
    | "red";

  text?: string;
  className?: string;
  uppercase?: boolean;
  capitalize?: boolean;
}

export const Text = React.memo(
  ({
    as: Component = "p",
    size = "body-lg-default",
    children,
    variant = "default",
    className,
    text,
    capitalize = false,
    uppercase = false,
    ...other
  }: propTypes) => {
    return (
      <Component
        className={classname(`${className}`, {
          "uppercase ": uppercase,
          "capitalize ": capitalize,
          //----------Size & FONT WEIGHT------------//
          //------------- rare or 700px  font with different sizes-----------------//
          "text-[36px] font-bold": size === "heading-lg-rare",
          "text-[24px] font-bold": size === "body-lg-rare",
          "text-[18px] font-bold": size === "body-md-rare",
          "text-[16px] font-bold": size == "body-base-rare",
          "text-[14px] font-bold": size === "body-sm-rare",
          "text-[12px] font-bold": size === "body-xs-rare",
          //-------------End of rare or 700px  font-----------------//

          //------------- lg or 600px  font with different sizes-----------------//
          "text-[36px] font-semibold": size === "heading-lg-lg",
          "text-[24px] font-semibold": size === "body-lg-lg",
          "text-[18px] font-semibold": size === "body-md-lg",
          "text-[16px] font-semibold": size == "body-base-lg",
          "text-[14px] font-semibold": size === "body-sm-lg",
          "text-[12px] font-semibold": size === "body-xs-lg",

          //-------------End of lg or 600px  font-----------------//

          //------------- Default or 500px  font with different sizes-----------------//
          "text-[36px] font-medium": size === "heading-lg-default",
          "text-[24px] font-medium": size === "body-lg-default",
          "text-[18px] font-medium": size === "body-md-default",
          "text-[16px] font-medium": size == "body-base-default",
          "text-[14px] font-medium": size === "body-sm-default",
          "text-[12px] font-medium": size === "body-xs-default",

          //-------------End of Default or 500px  font-----------------//

          //------------- mid or 400px  & font with different sizes-----------------//
          "text-[36px] font-normal": size === "heading-lg-mid",
          "text-[24px] font-normal": size === "body-lg-mid",
          "text-[18px] font-normal": size === "body-md-mid",
          "text-[16px] font-normal": size == "body-base-mid",
          "text-[14px] font-normal": size === "body-sm-mid",
          "text-[12px] font-normal": size === "body-xs-mid",
          //-------------End of mid or 700px  font-----------------//

          //------------- sm or 300px  & font with different sizes-----------------//
          "text-[36px] font-light": size === "heading-lg-sm",
          "text-[24px] font-light": size === "body-lg-sm",
          "text-[18px] font-light": size === "body-md-sm",
          "text-[16px] font-light": size == "body-base-sm",
          "text-[14px] font-light": size === "body-sm-sm",
          "text-[12px] font-light": size === "body-xs-sm",
          //-------------End of sm or 300px  font-----------------//

          //--------------------END of Size & FONT WEIGHT-------------------------//

          //----------color------------//
          "text-white": variant == "white",
          "text-black": variant == "default",
          "text-fade-black": variant == "fade-black",
          "text-grey-800": variant == "grey",
          "text-grey-300": variant == "grey-300",
          "text-primary-blue": variant == "primary-blue",
          "text-yellow": variant == "yellow",
          "text-border": variant == "border",
          "text-silver-500": variant == "silver-500",
          "text-silver-600": variant == "silver-600",
          "text-silver-950": variant == "silver-950",
          "text-lynch-400": variant == "lynch-400",
          "text-lynch-900": variant == "lynch-900",
          "text-fade-white": variant == "fade-white",
          "text-fadish-black": variant == "fadish-black",
          "text-grey-600": variant == "grey-600",
          "text-grey-400": variant == "grey-400",
          "text-grey-500": variant == "grey-500",
          "text-lime-green": variant == "lime-green",
          "text-red": variant == "red",

          //----------End of color------------//
        })}
        {...other}
      >
        {text || children}
      </Component>
    );
  }
);
