import Image from 'next/image';

interface FormTitleProps {
  title: string;
  subtitle?: string;
  logoSrc?: string;
  logoAlt?: string;
  titleImage?: { src: string; width: number; height: number };
}

export function FormTitle({ title, subtitle, logoSrc, logoAlt, titleImage }: FormTitleProps) {
    return (
        <>
            {logoSrc && (
                <div className="flex justify-center mb-6">
                    <Image src={logoSrc} alt={logoAlt || 'Logo'} width={150} height={150} className="object-contain" />
                </div>
            )}
            {titleImage ? (
                <h1 className="flex justify-center mb-6">
                    <Image
                        src={titleImage.src}
                        alt={title}
                        width={titleImage.width}
                        height={titleImage.height}
                        className="h-10 w-auto sm:h-12"
                    />
                </h1>
            ) : (
                <h1 className="text-center text-xl font-semibold text-zinc-800 mb-6">{title}</h1>
            )}
            {subtitle && (
                <p className="text-center text-sm text-zinc-600 mb-6">{subtitle}</p>
            )}
        </>
    )
}