import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/shadcn/lib/utils";
import {
    Label as AriaLabel,
    Text as AriaText,
    Group as AriaGroup,
} from "react-aria-components";

//
// Label
//
const labelVariants = cva([
    "text-sm font-medium leading-none",
    // Disabled
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70",
    // Invalid
    "group-data-[invalid]:text-destructive",
]);

interface LabelProps extends React.ComponentProps<typeof AriaLabel> {}

const Label = ({ className, ...props }: LabelProps) => (
    <AriaLabel className={cn(labelVariants(), className)} {...props} />
);

//
// Form Description
//
interface FormDescriptionProps
    extends React.ComponentProps<typeof AriaText> {}

function FormDescription({ className, ...props }: FormDescriptionProps) {
    return (
        <AriaText
            className={cn("text-sm text-muted-foreground", className)}
            slot="description"
            {...props}
        />
    );
}

//
// Field Error
//
interface FieldErrorProps extends React.ComponentProps<typeof AriaText> {}

function FieldError({ className, ...props }: FieldErrorProps) {
    return (
        <AriaText
            className={cn("text-sm font-medium text-destructive", className)}
            slot="errorMessage"
            {...props}
        />
    );
}

//
// Field Group
//
const fieldGroupVariants = cva("", {
    variants: {
        variant: {
            default: [
                "relative flex h-10 w-full items-center overflow-hidden rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                // Focus Within
                "data-[focus-within]:outline-none data-[focus-within]:ring-2 data-[focus-within]:ring-ring data-[focus-within]:ring-offset-2",
                // Disabled
                "data-[disabled]:opacity-50",
            ],
            ghost: "",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

interface FieldGroupProps
    extends React.ComponentProps<typeof AriaGroup>,
        VariantProps<typeof fieldGroupVariants> {}

function FieldGroup({ className, variant, ...props }: FieldGroupProps) {
    return (
        <AriaGroup
            className={cn(fieldGroupVariants({ variant }), className)}
            {...props}
        />
    );
}

export {
    Label,
    labelVariants,
    FieldGroup,
    fieldGroupVariants,
    FieldError,
    FormDescription,
};
