import pathlib

# Carpeta donde están tus artículos
BLOG_DIR = pathlib.Path("blog")

# Menú base (sin la clase active)
MENU_BASE = """
    <!-- MINI MENÚ DEL BLOG -->
    <nav class="mini-blog-menu">
      <a href="/blog/" class="mini-link">Destacados</a>
      <a href="/blog/#sueldos" class="mini-link{sueldos}">Sueldos</a>
      <a href="/blog/#impuestos" class="mini-link{impuestos}">Impuestos y boletas</a>
      <a href="/blog/#uf" class="mini-link{uf}">UF & reajustes</a>
      <a href="/blog/#afp" class="mini-link{afp}">AFP & salud</a>
      <a href="/blog/#beneficios" class="mini-link{beneficios}">Beneficios</a>
      <a href="/" class="mini-link" style="opacity:.85;">← Volver a calculadoras</a>
    </nav>

    <style>
      .mini-blog-menu {
        margin: 14px 0 22px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        font-size: 13px;
      }
      .mini-blog-menu .mini-link {
        padding: 6px 12px;
        border-radius: 20px;
        background: var(--chip-bg);
        border: 1px solid var(--border-subtle);
        color: var(--muted);
        text-decoration: none;
        transition: 0.2s ease;
      }
      .mini-blog-menu .mini-link.active {
        background: var(--primary-soft);
        border-color: var(--primary);
        color: var(--primary);
      }
      .mini-blog-menu .mini-link:hover {
        transform: translateY(-1px);
        color: var(--primary);
      }
    </style>
"""

# A qué categoría pertenece cada artículo (por nombre de archivo)
CATEGORY_MAP = {
    # Sueldos
    "sueldo-minimo-2026.html": "sueldos",
    "sueldo-liquido-2026.html": "sueldos",
    "bruto-desde-liquido-2026.html": "sueldos",
    "liquidacion-de-sueldo-2026.html": "sueldos",
    "gratificacion-legal-2026.html": "sueldos",
    "finiquito-2026.html": "sueldos",

    # Impuestos y boletas
    "impuesto-unico-2026.html": "impuestos",
    "impuesto-global-complementario-2026.html": "impuestos",
    "calcular-iva-2026.html": "impuestos",
    "iva-2026-guia.html": "impuestos",
    "retencion-boleta-2026.html": "impuestos",
    "cotizaciones-boletas-2026.html": "impuestos",
    "boleta-vs-empresa-2026.html": "impuestos",
    "tope-imponible-2026.html": "impuestos",

    # UF & reajustes
    "uf-2026.html": "uf",
    "proyeccion-uf-2026.html": "uf",
    "reajuste-arriendo-uf-2026.html": "uf",
    "ipc-2026.html": "uf",
    "reajuste-ipc-2026.html": "uf",

    # AFP & salud
    "afp-2026.html": "afp",
    "tasas-afp-2026.html": "afp",
    "salud-2026.html": "afp",
    "reajuste-isapres-2026.html": "afp",

    # Beneficios
    "asignacion-familiar-2026.html": "beneficios",
    "ingreso-minimo-no-remuneracional-2026.html": "beneficios",
}

SKIP_FILES = {"index.html", "blog-header.html"}

def build_menu(active_category: str) -> str:
    # Marca la categoría activa con " active"
    def flag(cat):
        return " active" if cat == active_category else ""
    return MENU_BASE.format(
        sueldos=flag("sueldos"),
        impuestos=flag("impuestos"),
        uf=flag("uf"),
        afp=flag("afp"),
        beneficios=flag("beneficios"),
    )

def process_file(path: pathlib.Path):
    name = path.name
    if name in SKIP_FILES:
        return

    html = path.read_text(encoding="utf-8")

    # Si ya tiene el menú, no tocamos
    if "mini-blog-menu" in html:
        print(f"[SKIP] {name} (ya tiene menú)")
        return

    category = CATEGORY_MAP.get(name)
    if not category:
        print(f"[WARN] {name} sin categoría en CATEGORY_MAP")
        return

    menu_html = build_menu(category)

    # Buscamos el final de la tarjeta "pill" en el HERO para insertar debajo
    marker = '</div>\n  </section>'
    if marker not in html:
        print(f"[WARN] No se encontró marcador en {name}")
        return

    new_html = html.replace(marker, f'</div>\n{menu_html}\n  </section>', 1)
    path.write_text(new_html, encoding="utf-8")
    print(f"[OK] Menú agregado a {name}")

def main():
    for path in BLOG_DIR.glob("*.html"):
        process_file(path)

if __name__ == "__main__":
    main()
