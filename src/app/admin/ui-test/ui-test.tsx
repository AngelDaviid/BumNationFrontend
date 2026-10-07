"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ChevronDown, Info } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import type { Category, Product, User } from "@/types";

import {
  ComponentOrigin,
  ComponentPreview,
  FixedFrame,
  OriginBadge,
  UiTestContext,
} from "./component-preview";

import { EditProductsForm } from "@/components/admin/products/edit-products-form";
import { EditUserForm } from "@/components/admin/users/edit-user-form";
import { columns as userColumns } from "@/app/admin/(users)/columns";
import { UserActionsCell } from "@/app/admin/(users)/user-actions-cell";
import { columns as productColumns } from "@/app/admin/productos/columns";

import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge as MembershipStatusBadge } from "@/components/membership/status-badge";
import ProductCard from "@/components/shop/product-cart";
import ProductList from "@/app/(shop)/products/product-list";
import { ProductCardSkeleton, ProductGridSkeleton } from "@/components/shop/product-card-skeleton";
import { CategoryFilter } from "@/components/shop/category-filter";

import Navbar from "@/components/navbar/nav-bar";
import { DesktopNavbar } from "@/components/navbar/desktop-navbar";
import { MobileNavbar } from "@/components/navbar/mobile-navbar";
import { MobileMenu } from "@/components/navbar/mobile-menu";
import { ProductsDropdown } from "@/components/navbar/products-dropdown";
import { SearchBar } from "@/components/navbar/search-navbar";
import { UserMenu } from "@/components/navbar/user-menu";
import { CartButton } from "@/components/navbar/cart-button";
import { useProductSearch } from "@/hooks/search/use-product-search";
import { useSearchDropdown } from "@/hooks/search/use-search-dropdown-menu";
import { useMobileMenu } from "@/hooks/search/use-mobiel-menu";
import { useMobileSearch } from "@/hooks/search/use-mobile-search";

import { AppSidebar } from "@/components/ui/app-sidebar";
import { NavUser } from "@/components/ui/nav-user";
import { DataTable } from "@/components/ui/data-table";
import { Loader, LoadingScreen } from "@/components/ui/loader";
import { DynamicModal } from "@/components/ui/dynamic-modal";
import { Field } from "@/components/ui/field";
import { FormCard } from "@/components/ui/form-card";
import { FormTitle } from "@/components/ui/form-title";
import { FormGrid } from "@/components/ui/from-grid";
import { ImageUpload } from "@/components/ui/image-uploader";
import { Input } from "@/components/ui/input";
import { StatusBadge as UiStatusBadge } from "@/components/ui/status-badge";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


const mockCategories: Category[] = [
  { id: 1, name: "Proteínas" },
  { id: 2, name: "Creatinas" },
  { id: 3, name: "Pre-entrenos" },
];

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Whey Protein Gold Standard 5lb",
    description: "Proteína de suero de leche",
    price: "289900",
    stock: 12,
    brand: "Optimum Nutrition",
    categoryId: 1,
    category: mockCategories[0],
    imageUrl: null,
    createdAt: "2026-06-15T10:00:00.000Z",
    updatedAt: "2026-06-15T10:00:00.000Z",
  },
  {
    id: 2,
    name: "Creatina Monohidratada 300g",
    description: null,
    price: "119900",
    stock: 0,
    brand: "Bum Nation",
    categoryId: 2,
    category: mockCategories[1],
    imageUrl: null,
    createdAt: "2026-06-20T10:00:00.000Z",
    updatedAt: "2026-06-20T10:00:00.000Z",
  },
];

const mockUsers: User[] = [
  {
    id: "3f6c2a1e-0000-4000-8000-000000000001",
    identification: "1020304050",
    firstName: "Laura",
    firstLastName: "Gómez",
    email: "laura@example.com",
    phone: "3001234567",
    imageUrl: null,
    role: "CLIENT",
    createdAt: "2026-06-15T10:00:00.000Z",
    updatedAt: "2026-06-15T10:00:00.000Z",
    gymMembership: null,
    membershipStats: null,
  },
  {
    id: "3f6c2a1e-0000-4000-8000-000000000002",
    identification: "1098765432",
    firstName: "Carlos",
    middleName: "Andrés",
    firstLastName: "Pérez",
    secondLastName: "Ruiz",
    email: "carlos@example.com",
    phone: null,
    imageUrl: null,
    role: "ADMIN",
    createdAt: "2026-07-01T10:00:00.000Z",
    updatedAt: "2026-07-01T10:00:00.000Z",
    gymMembership: null,
    membershipStats: null,
  },
];

interface DemoRow {
  id: number;
  name: string;
  email: string;
}

const demoColumns: ColumnDef<DemoRow>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Nombre" },
  { accessorKey: "email", header: "Email" },
];

const demoRows: DemoRow[] = [
  { id: 1, name: "Laura Gómez", email: "laura@example.com" },
  { id: 2, name: "Carlos Pérez", email: "carlos@example.com" },
  { id: 3, name: "Ana Torres", email: "ana@example.com" },
];


const sections: {
  title: string;
  origin: ComponentOrigin;
  items: { id: string; label: string }[];
}[] = [
  {
    title: "Tienda",
    origin: "propio",
    items: [
      { id: "product-card", label: "ProductCard" },
      { id: "product-list", label: "ProductList" },
      { id: "product-card-skeleton", label: "ProductCardSkeleton" },
      { id: "category-filter", label: "CategoryFilter" },
    ],
  },
  {
    title: "Navbar",
    origin: "propio",
    items: [
      { id: "navbar", label: "Navbar (completo)" },
      { id: "desktop-navbar", label: "DesktopNavbar" },
      { id: "mobile-navbar", label: "MobileNavbar" },
      { id: "mobile-menu", label: "MobileMenu" },
      { id: "search-bar", label: "SearchBar" },
      { id: "products-dropdown", label: "ProductsDropdown" },
      { id: "user-menu", label: "UserMenu" },
      { id: "cart-button", label: "CartButton" },
    ],
  },
  {
    title: "Admin",
    origin: "propio",
    items: [
      { id: "app-sidebar", label: "AppSidebar" },
      { id: "nav-user", label: "NavUser" },
      { id: "users-table", label: "Tabla de usuarios" },
      { id: "user-actions-cell", label: "UserActionsCell" },
      { id: "products-table", label: "Tabla de productos" },
      { id: "edit-product-form", label: "EditProductsForm" },
      { id: "edit-user-form", label: "EditUserForm" },
      { id: "stat-card", label: "StatCard" },
      { id: "membership-status-badge", label: "StatusBadge (membresía)" },
    ],
  },
  {
    title: "UI propios",
    origin: "propio",
    items: [
      { id: "loader", label: "Loader / LoadingScreen" },
      { id: "data-table", label: "DataTable" },
      { id: "dynamic-modal", label: "DynamicModal" },
      { id: "form-components", label: "FormCard / FormTitle / FormGrid / Field / Input" },
      { id: "image-upload", label: "ImageUpload" },
      { id: "ui-status-badge", label: "StatusBadge (ui)" },
    ],
  },
  {
    title: "UI shadcn",
    origin: "shadcn",
    items: [
      { id: "button", label: "Button" },
      { id: "badge", label: "Badge" },
      { id: "avatar", label: "Avatar" },
      { id: "checkbox", label: "Checkbox" },
      { id: "collapsible", label: "Collapsible" },
      { id: "dialog", label: "Dialog" },
      { id: "dropdown-menu", label: "DropdownMenu" },
      { id: "sheet", label: "Sheet" },
      { id: "tooltip", label: "Tooltip" },
      { id: "table", label: "Table" },
      { id: "pagination", label: "Pagination" },
      { id: "separator", label: "Separator" },
      { id: "skeleton", label: "Skeleton" },
      { id: "sonner", label: "Sonner (toast)" },
    ],
  },
];

const originById: Record<string, ComponentOrigin> = Object.fromEntries(
  sections.flatMap((section) => section.items.map((item) => [item.id, section.origin])),
);

const originCount = sections.reduce(
  (count, section) => ({ ...count, [section.origin]: count[section.origin] + section.items.length }),
  { propio: 0, shadcn: 0 } as Record<ComponentOrigin, number>,
);


function DesktopNavbarDemo() {
  const search = useProductSearch();
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdown = useSearchDropdown(containerRef);

  return (
    <DesktopNavbar
      categories={mockCategories}
      search={search}
      containerRef={containerRef}
      dropdown={dropdown}
    />
  );
}

function MobileNavbarDemo() {
  const search = useProductSearch();
  const menu = useMobileMenu();
  const mobileSearch = useMobileSearch();
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdown = useSearchDropdown(containerRef);

  return (
    <MobileNavbar
      categories={mockCategories}
      search={search}
      menu={menu}
      mobileSearch={mobileSearch}
      containerRef={containerRef}
      dropdown={dropdown}
    />
  );
}

function MobileMenuDemo() {
  const menu = useMobileMenu();

  return (
    <>
      <Button onClick={menu.toggle} className="relative z-50 m-3">
        {menu.isOpen ? "Cerrar menú" : "Abrir menú"}
      </Button>
      <MobileMenu categories={mockCategories} menu={menu} />
    </>
  );
}

function SearchBarDemo() {
  const search = useProductSearch();
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdown = useSearchDropdown(containerRef);

  return (
    <div className="flex flex-col gap-6">
      <SearchBar containerRef={containerRef} search={search} dropdown={dropdown} variant="desktop" />
    </div>
  );
}

function DataTableDemo() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = demoRows.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DataTable
      columns={demoColumns}
      data={filtered}
      searchValue={search}
      onSearchChange={setSearch}
      page={page}
      totalPages={3}
      onNextPage={() => setPage((p) => Math.min(p + 1, 3))}
      onPrevPage={() => setPage((p) => Math.max(p - 1, 1))}
      onRowClick={(row) => toast(`Fila: ${row.name}`)}
    />
  );
}

interface DemoFormValues {
  name: string;
  email: string;
  password: string;
}

function FormComponentsDemo() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DemoFormValues>();

  const onSubmit = (data: DemoFormValues) => {
    toast.success(`Enviado: ${data.name} / ${data.email}`);
  };

  return (
    <FormCard
      onSubmit={handleSubmit(onSubmit)}
      header={<FormTitle title="Formulario de prueba" subtitle="FormCard + FormTitle" logoSrc="/LogoNegro.webp" />}
      error="Así se ve el mensaje de error de FormCard"
      footer={
        <>
          <span className="text-xs text-zinc-500">Footer de FormCard</span>
          <Button type="submit">Enviar</Button>
        </>
      }
      className="bg-zinc-100"
    >
      <FormGrid columns={2}>
        <Field label="Nombre (Field)" error={errors.name?.message}>
          <Input
            placeholder="Tu nombre"
            error={errors.name?.message}
            registration={register("name", { required: "El nombre es requerido" })}
          />
        </Field>
        <Input
          label="Email (label propio de Input)"
          type="email"
          placeholder="correo@ejemplo.com"
          error={errors.email?.message}
          registration={register("email", { required: "El email es requerido" })}
        />
      </FormGrid>
      <Input
        label="Contraseña (con rightElement)"
        type="password"
        placeholder="••••••••"
        registration={register("password")}
        rightElement={<Info size={16} className="text-zinc-400" />}
      />
    </FormCard>
  );
}


export function UiTest() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reportError = useCallback((id: string, error: Error) => {
    setErrors((prev) => (prev[id] === error.message ? prev : { ...prev, [id]: error.message }));
  }, []);

  const contextValue = useMemo(
    () => ({ reportError, originOf: (id: string) => originById[id] ?? "propio" }),
    [reportError],
  );
  const errorIds = Object.keys(errors);

  return (
    <UiTestContext.Provider value={contextValue}>
      <div className="flex gap-6 text-zinc-900">
        <aside className="sticky top-4 hidden max-h-[calc(100vh-2rem)] w-60 shrink-0 self-start overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 xl:block">
          <p className="mb-4 text-lg font-bold">UI Test</p>
          {sections.map((section) => (
            <div key={section.title} className="mb-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  {section.title}
                </p>
                <OriginBadge origin={section.origin} />
              </div>
              <ul>
                {section.items.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`block rounded px-2 py-1 text-sm hover:bg-zinc-100 ${
                        errors[item.id] ? "font-medium text-red-600" : "text-zinc-700"
                      }`}
                    >
                      {errors[item.id] ? "✕ " : ""}
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        <div className="min-w-0 flex-1 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-bold">Catálogo de componentes</h1>
            <p className="text-sm text-zinc-600">
              Cada componente se renderiza dentro de su propio Error Boundary. Si uno falla, verás el
              error en su tarjeta y el resto seguirá funcionando. Los errores dentro de eventos
              (onClick, etc.), las imágenes rotas y los errores de red no se capturan aquí: revisa
              también la consola del navegador.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
              <span className="flex items-center gap-2">
                <OriginBadge origin="propio" /> {originCount.propio} creados por ti
              </span>
              <span className="flex items-center gap-2">
                <OriginBadge origin="shadcn" /> {originCount.shadcn} generados con{" "}
                <code className="text-xs">npx shadcn add</code>
              </span>
            </div>
            {errorIds.length > 0 ? (
              <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                <p className="font-semibold">
                  {errorIds.length} componente(s) con error de renderizado:
                </p>
                <ul className="mt-2 list-inside list-disc">
                  {errorIds.map((id) => (
                    <li key={id}>
                      <a href={`#${id}`} className="underline">
                        {id}
                      </a>
                      : {errors[id]}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-700">
                Ningún componente lanzó errores de renderizado.
              </div>
            )}
          </header>

          {/* ------------------------------------------------------------ Tienda */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Tienda</h2>

            <ComponentPreview
              id="product-card"
              title="ProductCard"
              file="src/components/shop/product-cart.tsx"
              notes={[
                "El segundo producto tiene stock 0 para ver el estado agotado",
              ]}
            >
              <div className="flex flex-wrap gap-6">
                {mockProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(p) => toast(`Agregar al carrito: ${p.name}`)}
                    onToggleFavorite={(p) => toast(`Favorito: ${p.name}`)}
                  />
                ))}
              </div>
            </ComponentPreview>

            <ComponentPreview
              id="product-list"
              title="ProductList"
              file="src/app/(shop)/products/product-list.tsx"
              notes={["Consume la API real: necesita el backend corriendo"]}
            >
              <ProductList />
            </ComponentPreview>

            <ComponentPreview
              id="product-card-skeleton"
              title="ProductCardSkeleton / ProductGridSkeleton"
              file="src/components/shop/product-card-skeleton.tsx"
              dark
            >
              <div className="space-y-8">
                <div className="flex flex-wrap gap-6">
                  <ProductCardSkeleton />
                  {mockProducts.slice(0, 1).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <ProductGridSkeleton count={4} />
              </div>
            </ComponentPreview>

            <ComponentPreview
              id="category-filter"
              title="CategoryFilter"
              file="src/components/shop/category-filter.tsx"
              dark
            >
              <CategoryFilter
                categories={mockCategories}
                activeCategoryId="2"
                buildHref={(id) => (id ? `#category-${id}` : "#category-filter")}
              />
            </ComponentPreview>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold">Navbar</h2>

            <ComponentPreview
              id="navbar"
              title="Navbar (el que usa el layout de la tienda)"
              file="src/components/navbar/nav-bar.tsx"
              notes={[
                "Carga las categorías desde la API",
                "Cambia el ancho de la ventana para ver la versión escritorio y la móvil",
              ]}
            >
              <FixedFrame height={140}>
                <Navbar />
              </FixedFrame>
            </ComponentPreview>

            <ComponentPreview
              id="desktop-navbar"
              title="DesktopNavbar"
              file="src/components/navbar/desktop-navbar.tsx"
              notes={[
                "Solo es visible con un ancho de 768px o más (md)",
                "Si eres admin solo muestra el enlace a /admin",
              ]}
            >
              <FixedFrame height={110}>
                <DesktopNavbarDemo />
              </FixedFrame>
            </ComponentPreview>

            <ComponentPreview
              id="mobile-navbar"
              title="MobileNavbar"
              file="src/components/navbar/mobile-navbar.tsx"
              notes={[
                "Solo es visible con un ancho menor a 768px",
              ]}
            >
              <FixedFrame height={480}>
                <MobileNavbarDemo />
              </FixedFrame>
            </ComponentPreview>

            <ComponentPreview
              id="mobile-menu"
              title="MobileMenu"
              file="src/components/navbar/mobile-menu.tsx"
              notes={["Solo es visible con un ancho menor a 768px"]}
            >
              <FixedFrame height={520}>
                <MobileMenuDemo />
              </FixedFrame>
            </ComponentPreview>

            <ComponentPreview
              id="search-bar"
              title="SearchBar"
              file="src/components/navbar/search-navbar.tsx"
              notes={["Las sugerencias vienen de la API; al hacer clic se abre el detalle del producto"]}
              dark
            >
              <div className="min-h-64">
                <SearchBarDemo />
              </div>
            </ComponentPreview>

            <ComponentPreview
              id="products-dropdown"
              title="ProductsDropdown"
              file="src/components/navbar/products-dropdown.tsx"
              dark
            >
              <ProductsDropdown categories={mockCategories} />
            </ComponentPreview>

            <ComponentPreview
              id="user-menu"
              title="UserMenu"
              file="src/components/navbar/user-menu.tsx"
              notes={["Muestra LogIn o el menú de cuenta según tu sesión actual"]}
              dark
            >
              <UserMenu />
            </ComponentPreview>

            <ComponentPreview
              id="cart-button"
              title="CartButton"
              file="src/components/navbar/cart-button.tsx"
              dark
            >
              <div className="flex items-center gap-10">
                <CartButton />
              </div>
            </ComponentPreview>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold">Admin</h2>

            <ComponentPreview
              id="app-sidebar"
              title="AppSidebar"
              file="src/components/ui/app-sidebar.tsx"
              notes={["En pantallas pequeñas el sidebar se convierte en un Sheet"]}
            >
              <FixedFrame height={560}>
                <SidebarProvider className="min-h-0 h-full">
                  <AppSidebar />
                  <SidebarInset>
                    <p className="p-6 text-sm text-zinc-500">Contenido (SidebarInset)</p>
                  </SidebarInset>
                </SidebarProvider>
              </FixedFrame>
            </ComponentPreview>

            <ComponentPreview
              id="nav-user"
              title="NavUser"
              file="src/components/ui/nav-user.tsx"
              notes={["No renderiza nada si no has iniciado sesión"]}
              dark
            >
              <SidebarProvider className="min-h-0 w-72">
                <NavUser />
              </SidebarProvider>
            </ComponentPreview>

            <ComponentPreview
              id="users-table"
              title="Tabla de usuarios (DataTable + columns)"
              file="src/app/admin/(users)/columns.tsx"
            >
              <DataTable columns={userColumns} data={mockUsers} />
            </ComponentPreview>

            <ComponentPreview
              id="user-actions-cell"
              title="UserActionsCell"
              file="src/app/admin/(users)/user-actions-cell.tsx"
              notes={["Guardar en el modal llama a la API real"]}
            >
              <UserActionsCell user={mockUsers[0]} />
            </ComponentPreview>

            <ComponentPreview
              id="products-table"
              title="Tabla de productos (DataTable + columns)"
              file="src/app/admin/productos/columns.tsx"
            >
              <DataTable columns={productColumns} data={mockProducts} />
            </ComponentPreview>

            <ComponentPreview
              id="edit-product-form"
              title="EditProductsForm"
              file="src/components/admin/products/edit-products-form.tsx"
              notes={["Enviar llama a la API real"]}
            >
              <EditProductsForm
                productId={mockProducts[0].id}
                defaultValues={{
                  name: mockProducts[0].name,
                  description: mockProducts[0].description,
                  price: mockProducts[0].price,
                  stock: mockProducts[0].stock,
                  brand: mockProducts[0].brand,
                  categoryId: mockProducts[0].categoryId,
                }}
                onSuccess={() => toast.success("Producto actualizado")}
              />
            </ComponentPreview>

            <ComponentPreview
              id="edit-user-form"
              title="EditUserForm"
              file="src/components/admin/users/edit-user-form.tsx"
              notes={["Enviar llama a la API real"]}
            >
              <EditUserForm user={mockUsers[1]} onSuccess={() => toast.success("Usuario actualizado")} />
            </ComponentPreview>

            <ComponentPreview id="stat-card" title="StatCard" file="src/components/dashboard/stat-card.tsx">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Usuarios" value={128} />
                <StatCard label="Activos" value={96} accent />
                <StatCard label="Sin membresía" value="32" />
              </div>
            </ComponentPreview>

            <ComponentPreview
              id="membership-status-badge"
              title="StatusBadge (membresía)"
              file="src/components/membership/status-badge.tsx"
            >
              <div className="flex flex-wrap gap-2">
                <MembershipStatusBadge status="ACTIVE" />
                <MembershipStatusBadge status="EXPIRED" />
                <MembershipStatusBadge status="SUSPENDED" />
                <MembershipStatusBadge status="CANCELLED" />
                <MembershipStatusBadge status={null} />
              </div>
            </ComponentPreview>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold">UI propios</h2>

            <ComponentPreview id="loader" title="Loader / LoadingScreen" file="src/components/ui/loader.tsx">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-8 rounded-lg bg-zinc-950 p-6">
                  <Loader size="sm" />
                  <Loader size="md" />
                  <Loader size="lg" />
                  <Loader label="Cargando productos…" />
                </div>
                <div className="flex flex-wrap items-center gap-8 rounded-lg border border-zinc-200 p-6">
                  <Loader size="sm" tone="light" />
                  <Loader tone="light" />
                  <Loader tone="light" label="Guardando…" />
                </div>
                <LoadingScreen className="min-h-80 rounded-lg" />
              </div>
            </ComponentPreview>

            <ComponentPreview id="data-table" title="DataTable" file="src/components/ui/data-table.tsx">
              <div className="space-y-6">
                <DataTableDemo />
                <DataTable columns={demoColumns} data={[]} isLoading />
                <DataTable columns={demoColumns} data={[]} />
              </div>
            </ComponentPreview>

            <ComponentPreview id="dynamic-modal" title="DynamicModal" file="src/components/ui/dynamic-modal.tsx">
              <div className="flex flex-wrap gap-3">
                {(["sm", "md", "lg", "xl", "full"] as const).map((size) => (
                  <DynamicModal
                    key={size}
                    title={`Modal ${size}`}
                    description="Descripción opcional del modal"
                    size={size}
                    trigger={<Button variant="outline">Abrir {size}</Button>}
                    closeOnOutsideClick={true}
                  >
                    {(close) => (
                      <div className="space-y-4">
                        <p className="text-sm">Contenido del modal de tamaño {size}.</p>
                        <Button onClick={close}>Cerrar con close()</Button>
                      </div>
                    )}
                  </DynamicModal>
                ))}
              </div>
            </ComponentPreview>

            <ComponentPreview
              id="form-components"
              title="FormCard / FormTitle / FormGrid / Field / Input"
              file="src/components/ui/{form-card,form-title,from-grid,field,input}.tsx"
            >
              <FormComponentsDemo />
            </ComponentPreview>

            <ComponentPreview id="image-upload" title="ImageUpload" file="src/components/ui/image-uploader.tsx">
              <div className="flex flex-wrap items-start gap-6">
                <ImageUpload onChange={(file) => toast(file ? `Archivo: ${file.name}` : "Imagen quitada")} />
                <ImageUpload shape="circle" onChange={() => {}} />
                <ImageUpload shape="circle" isUploading onChange={() => {}} />
              </div>
            </ComponentPreview>

            <ComponentPreview id="ui-status-badge" title="StatusBadge (ui)" file="src/components/ui/status-badge.tsx">
              <div className="flex flex-wrap gap-2">
                <UiStatusBadge TypeStatus="success" />
                <UiStatusBadge TypeStatus="warning" />
                <UiStatusBadge TypeStatus="error" />
                <UiStatusBadge TypeStatus="info" />
              </div>
            </ComponentPreview>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold">UI shadcn</h2>

            <ComponentPreview id="button" title="Button" file="src/components/ui/button.tsx">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(["default", "outline", "secondary", "ghost", "destructive", "link"] as const).map((variant) => (
                    <Button key={variant} variant={variant}>
                      {variant}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {(["xs", "sm", "default", "lg"] as const).map((size) => (
                    <Button key={size} size={size}>
                      {size}
                    </Button>
                  ))}
                  <Button disabled>disabled</Button>
                </div>
              </div>
            </ComponentPreview>

            <ComponentPreview id="badge" title="Badge" file="src/components/ui/badge.tsx">
              <div className="flex flex-wrap gap-2">
                {(["default", "secondary", "destructive", "outline", "ghost", "link"] as const).map((variant) => (
                  <Badge key={variant} variant={variant}>
                    {variant}
                  </Badge>
                ))}
              </div>
            </ComponentPreview>

            <ComponentPreview id="avatar" title="Avatar" file="src/components/ui/avatar.tsx">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src="/LogoNegro.webp" alt="Logo" />
                  <AvatarFallback>BN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage src="/no-existe.png" alt="Sin imagen" />
                  <AvatarFallback>LG</AvatarFallback>
                </Avatar>
              </div>
            </ComponentPreview>

            <ComponentPreview id="checkbox" title="Checkbox" file="src/components/ui/checkbox.tsx">
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <label className="flex items-center gap-2">
                  <Checkbox /> Normal
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox defaultChecked /> Marcado
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox checked="indeterminate" /> Indeterminado
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox disabled /> Deshabilitado
                </label>
              </div>
            </ComponentPreview>

            <ComponentPreview id="collapsible" title="Collapsible" file="src/components/ui/collapsible.tsx">
              <Collapsible className="w-72 rounded-lg border p-3">
                <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium">
                  Ver más <ChevronDown size={16} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 text-sm text-zinc-600">
                  Contenido colapsable.
                </CollapsibleContent>
              </Collapsible>
            </ComponentPreview>

            <ComponentPreview id="dialog" title="Dialog" file="src/components/ui/dialog.tsx">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Abrir dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Título del dialog</DialogTitle>
                    <DialogDescription>Descripción del dialog.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button>Aceptar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </ComponentPreview>

            <ComponentPreview id="dropdown-menu" title="DropdownMenu" file="src/components/ui/dropdown-menu.tsx">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Abrir menú</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Perfil</DropdownMenuItem>
                  <DropdownMenuItem>Órdenes</DropdownMenuItem>
                  <DropdownMenuItem disabled>Deshabilitado</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ComponentPreview>

            <ComponentPreview id="sheet" title="Sheet" file="src/components/ui/sheet.tsx">
              <div className="flex flex-wrap gap-2">
                {(["left", "right", "top", "bottom"] as const).map((side) => (
                  <Sheet key={side}>
                    <SheetTrigger asChild>
                      <Button variant="outline">{side}</Button>
                    </SheetTrigger>
                    <SheetContent side={side}>
                      <SheetHeader>
                        <SheetTitle>Sheet {side}</SheetTitle>
                        <SheetDescription>Contenido del sheet.</SheetDescription>
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>
                ))}
              </div>
            </ComponentPreview>

            <ComponentPreview id="tooltip" title="Tooltip" file="src/components/ui/tooltip.tsx">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Pasa el mouse</Button>
                </TooltipTrigger>
                <TooltipContent>Soy un tooltip</TooltipContent>
              </Tooltip>
            </ComponentPreview>

            <ComponentPreview id="table" title="Table" file="src/components/ui/table.tsx">
              <Table>
                <TableCaption>Tabla simple de shadcn</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell className="text-right">{product.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ComponentPreview>

            <ComponentPreview id="pagination" title="Pagination" file="src/components/ui/pagination.tsx">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#pagination" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#pagination">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#pagination" isActive>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#pagination" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </ComponentPreview>

            <ComponentPreview id="separator" title="Separator" file="src/components/ui/separator.tsx">
              <div className="space-y-3 text-sm">
                <p>Arriba</p>
                <Separator />
                <div className="flex h-5 items-center gap-3">
                  <span>Izquierda</span>
                  <Separator orientation="vertical" />
                  <span>Derecha</span>
                </div>
              </div>
            </ComponentPreview>

            <ComponentPreview id="skeleton" title="Skeleton" file="src/components/ui/skeleton.tsx">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </ComponentPreview>

            <ComponentPreview id="sonner" title="Sonner (toast)" file="src/components/ui/sonner.tsx">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => toast("Toast normal")}>
                  Normal
                </Button>
                <Button variant="outline" onClick={() => toast.success("Todo salió bien")}>
                  Success
                </Button>
                <Button variant="outline" onClick={() => toast.error("Algo falló")}>
                  Error
                </Button>
                <Button variant="outline" onClick={() => toast.warning("Cuidado")}>
                  Warning
                </Button>
                <Button variant="outline" onClick={() => toast.info("Información")}>
                  Info
                </Button>
              </div>
            </ComponentPreview>
          </div>
        </div>
      </div>
    </UiTestContext.Provider>
  );
}
