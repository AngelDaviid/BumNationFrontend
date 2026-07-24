import Image from 'next/image';

interface FormTitleProps {
  title: string;
  subtitle?: string;
  logoSrc?: string;
  logoAlt?: string;
}

export function FormTitle({ title, subtitle, logoSrc, logoAlt }: FormTitleProps) {
    return (
        <>
            {logoSrc && (
                <div className="flex justify-center mb-6">
                    <Image src={logoSrc} alt={logoAlt || 'Logo'} width={100} height={100} className="object-contain" />
                </div>
            )}
            <h1 className="text-center text-xl font-semibold text-zinc-800 mb-6">{title}</h1>
            {subtitle && (
                <p className="text-center text-sm text-zinc-600 mb-6">{subtitle}</p>
            )}
        </>
    )
}