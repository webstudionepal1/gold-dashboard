import { cn } from "../../lib/utils";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
                className,
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                'group/bento shadow-input row-span-1 flex flex-col justify-between space-y-4 rounded-xl border p-4 transition duration-200 hover:shadow-sm',
                className,
            )}
        >
            {header}
            {(icon || title || description) && (
                <div className="transition duration-200 group-hover/bento:translate-x-2">
                    {icon && icon}
                    {title && (
                        <div className="font-sans font-bold text-black ">
                            {title}
                        </div>
                    )}
                    {description && (
                        <div className="font-sans text-xs font-normal text-black">
                            {description}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
