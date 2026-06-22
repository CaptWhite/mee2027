export type MenuTab = 'Astrometría' | 'Distorsión' | 'Deflexión';

export interface DocItem {
  filename: string;
  menutab: MenuTab;
  id: string;
  slug: string;
  description: string;
  chapter: string;
}

export const docList: DocItem[] = [
  {
    filename: 'my_platesolve.md',
    menutab: 'Astrometría',
    id: 'my_platesolve',
    slug: 'my_platesolve',
    description: 'Calibración y PlateSolving',
    chapter: '1',
  },
  {
    filename: 'parametros.md',
    menutab: 'Astrometría',
    id: 'parametros',
    slug: 'parametros',
    description: 'Parámetros',
    chapter: '1.1',
  },
  {
    filename: 'my_database_lookup2.md',
    menutab: 'Astrometría',
    id: 'my_database_lookup2',
    slug: 'my_database_lookup2',
    description: 'Indexación de base de datos',
    chapter: '2',
  },
  {
    filename: 'my_database_cache.md',
    menutab: 'Astrometría',
    id: 'my_database_cache',
    slug: 'my_database_cache',
    description: 'Persistencia en base de datos',
    chapter: '3',
  },
  {
    filename: 'my_platesolve_new.md',
    menutab: 'Astrometría',
    id: 'my_platesolve_new',
    slug: 'my_platesolve_new',
    description: 'Generador de base de datos',
    chapter: '4',
  },
  {
    filename: 'my_platesolve_new_commented2.md',
    menutab: 'Astrometría',
    id: 'my_platesolve_new_commented2',
    slug: 'my_platesolve_new_commented2',
    description: 'Generador de base de datos 2',
    chapter: '4.1',
  }, 
  {
    filename: 'my_platesolve_triangle.md',
    menutab: 'Astrometría',
    id: 'my_platesolve_triangle',
    slug: 'my_platesolve_triangle',
    description: 'Triangulación PlateSolve',
    chapter: '5',
  },
  {
    filename: 'my_stacker_implementattion.md',
    menutab: 'Astrometría',
    id: 'my_stacker_implementattion',
    slug: 'my_stacker_implementattion',
    description: 'Centroides y Apilado',
    chapter: '6',
  },
  {
    filename: '07_attempt_align.md',
    menutab: 'Astrometría',
    id: '07_attempt_align',
    slug: '07_attempt_align',
    description: 'Apilado',
    chapter: '6.1',
  },
  {
    filename: 'my_distortion_fitter.md',
    menutab: 'Distorsión',
    id: 'my_distortion_fitter',
    slug: 'my_distortion_fitter',
    description: 'Ajuste de la distorsión',
    chapter: '1',
  },
  {
    filename: 'my_distortion_fitter - match_and_fit_distortion.md',
    menutab: 'Distorsión',
    id: 'my_distortion_fitter---match_and_fit_distortion',
    slug: 'my_distortion_fitter-match-and-fit-distortion',
    description: '. Ajuste y coincidencia',
    chapter: '1.2',
  },
  {
    filename: 'my_distortion_fitter - match_centroids.md',
    menutab: 'Distorsión',
    id: 'my_distortion_fitter---match_centroids',
    slug: 'my_distortion_fitter-match-centroids',
    description: '. Coincidencia de centroides',
    chapter: '1.3',
  },
  {
    filename: 'my_distortion_polynomial.md',
    menutab: 'Distorsión',
    id: 'my_distortion_polynomial',
    slug: 'my_distortion_polynomial',
    description: 'Distorsión polinomial',
    chapter: '2',
  },
  {
    filename: 'my_distortion_polynomial - do_cubic_fit.md',
    menutab: 'Distorsión',
    id: 'my_distortion_polynomial---do_cubic_fit',
    slug: 'my_distortion_polynomial-do-cubic-fit',
    description: '. Ajuste cúbico',
    chapter: '2.1',
  },
  {
    filename: 'my_distortion_polynomial - _cubic_helper.md',
    menutab: 'Distorsión',
    id: 'my_distortion_polynomial---_cubic_helper',
    slug: 'my_distortion_polynomial-cubic-helper',
    description: '. Asistente cúbico',
    chapter: '2.2',
  },
  {
    filename: 'my_distortion_polynomial - apply_corrections.md',
    menutab: 'Distorsión',
    id: 'my_distortion_polynomial---apply_corrections',
    slug: 'my_distortion_polynomial-apply-corrections',
    description: '. Aplicar correcciones',
    chapter: '2.3',
  },
  {
    filename: 'my_platesolve_triangle - platesolve.md',
    menutab: 'Distorsión',
    id: 'my_platesolve_triangle---platesolve',
    slug: 'my_platesolve_triangle-platesolve',
    description: 'Triangulación para platesolve',
    chapter: '3',
  },
  {
    filename: 'my_platesolve_triangle - _platesolve _helper.md',
    menutab: 'Distorsión',
    id: 'my_platesolve_triangle---_platesolve-_helper',
    slug: 'my_platesolve_triangle-platesolve-helper',
    description: '. Asistente platesolve',
    chapter: '3.1',
  },
  {
    filename: 'my_refraction_correction.md',
    menutab: 'Distorsión',
    id: 'my_refraction_correction',
    slug: 'my_refraction_correction',
    description: 'Corrección de refracción',
    chapter: '4',
  },
  {
    filename: 'my_gravity_sweep.md',
    menutab: 'Distorsión',
    id: 'my_gravity_sweep',
    slug: 'my_gravity_sweep',
    description: 'Barrido gravitacional',
    chapter: '5',
  },
  {
    filename: 'my_gaia_search.md',
    menutab: 'Distorsión',
    id: 'my_gaia_search',
    slug: 'my_gaia_search',
    description: 'Búsqueda en Gaia',
    chapter: '6',
  },
  {
    filename: '02_eclipse_analysis.md',
    menutab: 'Deflexión',
    id: '02_eclipse_analysis',
    slug: '02_eclipse_analysis',
    description: 'Análisi del Eclipse',
    chapter: '1',
  },

];

export const docMapById = new Map<string, DocItem>(
  docList.map(item => [item.id, item])
);

export const docMapBySlug = new Map<string, DocItem>(
  docList.map(item => [item.slug, item])
);
