import { L, image, video } from './media.js'

// The order of `media` is public: deep links and the links in the CV (#section/entry/media)
// depend on it. Reordering means updating them.

export const research = [
  {
    id: 'quadruped',
    model: 'coco1',
    title: L('Quadruped Robot', 'Robot cuadrúpedo'),
    subtitle: L('Coco, the robot cat', 'Coco, el robot gato'),
    description: L(
      '12-DOF servo-actuated quadruped robot developed in ROS 2. A personal project that I design and build from scratch.',
      'Robot cuadrúpedo de 12 grados de libertad, accionado por servomotores y desarrollado con ROS 2. Un proyecto personal que diseño y construyo desde cero.',
    ),
    research: L(
      'Associated research: "A Reactive Single-Step Horizon Control Pipeline for Robust Quadruped Locomotion under Actuation Uncertainty". First author, submitted to IEEE ICRA 2027 (decision pending).',
      'Investigación asociada: "A Reactive Single-Step Horizon Control Pipeline for Robust Quadruped Locomotion under Actuation Uncertainty". Primer autor, enviado a IEEE ICRA 2027 (pendiente de decisión).',
    ),
    media: [
      video('coco-icra', 'cN7WDKmJhnM', 'Quadruped Locomotion under Actuation Uncertainty - ICRA 2027 Submission', 'Quadruped Locomotion under Actuation Uncertainty - Envío a ICRA 2027'),
      video('coco-control', '6V8-M2vEC8k', 'Coco mov control v2.0', 'Control de movimiento de Coco v2.0'),
      video('coco-redesign', 'yG2TFrFOs4w', 'COCO body redesign, AI-generated illustrative video', 'Rediseño del cuerpo de COCO, vídeo ilustrativo generado con IA', { autoplay: true }),
      image(
        'cocov2_photo1.jpg',
        'White Coco quadruped robot with a cat head and sunglasses, seen from the side',
        'Robot cuadrúpedo Coco blanco, con cabeza de gato y gafas de sol, visto de lado',
      ),
      image(
        'cocov2_summit1.jpg',
        'Justo with the quadruped robots at an exhibition stand, START Summit banners behind',
        'Justo junto a los robots cuadrúpedos en un stand, con carteles de START Summit detrás',
      ),
      image(
        'cocov2_photo2.jpg',
        'White Coco quadruped robot seen from the front',
        'Robot cuadrúpedo Coco blanco visto de frente',
      ),
      image(
        'coco_summit.jpg',
        'Coco robots on a stand table under purple light, a START Munich banner behind',
        'Robots Coco sobre la mesa de un stand con luz morada, con un cartel de START Munich detrás',
      ),
      image(
        'cocov1.jpg',
        'First black version of the quadruped robot',
        'Primera versión del robot cuadrúpedo, de color negro',
      ),
      video('coco-ik', '99Eip2nVok4', 'Coco Quadruped Robot Inverse Kinematics rotation of body frame test', 'Robot cuadrúpedo Coco: prueba de cinemática inversa con rotación del cuerpo'),
      video('coco-trot', '0X7ajcaga7c', 'Coco Quadruped - Trot Gait Test', 'Cuadrúpedo Coco: prueba de marcha al trote'),
      image(
        'rpycoco.png',
        'Sequence of photos of the black quadruped showing roll, pitch and yaw body poses',
        'Secuencia de fotos del cuadrúpedo negro mostrando posturas de roll, pitch y yaw',
      ),
    ],
  },
]

// Not a carousel: a compact panel with its own station on the rail.
export const publications = [
  {
    id: 'icra2027',
    title: 'A Reactive Single-Step Horizon Control Pipeline for Robust Quadruped Locomotion under Actuation Uncertainty',
    status: L('Manuscript submitted', 'Manuscrito enviado'),
    role: L('First author', 'Primer autor'),
    venue: L(
      'Submitted to the IEEE International Conference on Robotics and Automation (ICRA 2027)',
      'Enviado a la IEEE International Conference on Robotics and Automation (ICRA 2027)',
    ),
    collaboration: L(
      'International research collaboration with Fan Mo Lab, University of Electronic Science and Technology of China (UESTC).',
      'Colaboración internacional de investigación con Fan Mo Lab, University of Electronic Science and Technology of China (UESTC).',
    ),
    link: {
      url: 'https://youtu.be/cN7WDKmJhnM',
      label: L('Supplementary video', 'Vídeo suplementario'),
    },
  },
]

export const responsibility = [
  {
    id: 'robotech',
    model: 'scara',
    title: L('RoboTech Student Association', 'RoboTech Student Association'),
    role: L('Treasurer & SCARA Project Lead', 'Tesorero y líder del proyecto SCARA'),
    organization: 'Universidad Rey Juan Carlos',
    dates: L('Jan 2025 – Present', 'Ene 2025 – Actualidad'),
    description: L(
      'The SCARA Project aims to combine advanced control systems with AI-based decision making so that our robot can play chess autonomously. It currently plays tic-tac-toe, as shown in the demo.',
      'El proyecto SCARA busca combinar sistemas avanzados de control con toma de decisiones basada en inteligencia artificial para que nuestro robot juegue al ajedrez de forma autónoma. De momento juega al 3 en raya, como se ve en la demo.',
    ),
    link: {
      url: 'https://robotech-urjc.github.io/mainweb/',
      label: L('Visit RoboTech website', 'Visitar la web de RoboTech'),
    },
    media: [
      video('scara-demo', '4r0j4g5fImk', 'RoboTech SCARA Robot Autonomously playing tic-tac-toe', 'Robot SCARA de RoboTech jugando al 3 en raya de forma autónoma'),
      image(
        'scarav1-2.jpg',
        'SCARA robot arm on a workbench above a three-by-three game board',
        'Brazo robótico SCARA sobre una mesa de trabajo, encima de un tablero de tres por tres',
      ),
    ],
  },
  {
    id: 'tsb',
    model: 'sp01',
    title: L('Técnico Solar Boat', 'Técnico Solar Boat'),
    role: L('Autonomous Systems Member — Mapping Lead', 'Miembro de Sistemas Autónomos — Mapping Lead'),
    dates: L('Aug 2025 – Mar 2026', 'Ago 2025 – Mar 2026'),
    description: L(
      'Responsible for the mapping implementation within the autonomous navigation stack.',
      'Responsable de la implementación del mapping dentro de la arquitectura de navegación autónoma del proyecto.',
    ),
    link: {
      url: 'https://tecnicosolarboat.com/',
      label: L('Visit Técnico Solar Boat website', 'Visitar la web de Técnico Solar Boat'),
    },
    media: [
      image(
        'inflationlayeradded.png',
        'Costmap visualisation with an inflation layer around detected obstacles',
        'Visualización de un costmap con una capa de inflación alrededor de los obstáculos detectados',
      ),
      image(
        'tsbsimulation.png',
        'Simulation of the autonomous boat on dark water with marker buoys ahead',
        'Simulación del barco autónomo sobre agua oscura con boyas de referencia al frente',
      ),
      video('tsb-mapping', '_bkvL-_BGiE', 'Mapping Test 02', 'Prueba de mapping 02'),
      image(
        'sp01.jpg',
        'White SP01 solar catamaran with a shark mouth painted on its bow, resting on shallow water',
        'Catamarán solar SP01 blanco, con una boca de tiburón pintada en la proa, sobre aguas poco profundas',
      ),
      image(
        'sp012.jpg',
        'SP01 on the water among red, green and yellow buoys, under the text "Njord challenge 2nd Place"',
        'SP01 en el agua entre boyas rojas, verdes y amarillas, bajo el texto "Njord challenge 2nd Place"',
      ),
    ],
  },
]

export const projects = [
  {
    id: 'so101-tidy',
    model: 'so101',
    title: L('Autonomous Table-Tidying with a LeRobot SO-101 Arm', 'Ordenado autónomo de una mesa con un brazo LeRobot SO-101'),
    subtitle: L('ERH Physical AI Hackathon, Black Forest Labs track: 2nd place', 'ERH Physical AI Hackathon, track de Black Forest Labs: 2.º puesto'),
    description: L(
      'Developed a robotic manipulation pipeline combining a Vision-Language Model (VLM) for high-level task decomposition with FLUX 3 Action, a fine-tuned World Action Model (WAM), enabling a physical LeRobot SO-101 arm to perform autonomous tabletop-cleanup tasks using teleoperated demonstrations.',
      'Desarrollo de un pipeline de manipulación que combina un Vision-Language Model (VLM) para la descomposición de tareas de alto nivel con FLUX 3 Action, un World Action Model (WAM) con fine-tuning, para que un brazo físico LeRobot SO-101 ordene una mesa de forma autónoma a partir de demostraciones teleoperadas.',
    ),
    media: [
      image(
        'best_moments_grid.gif',
        'Animated grid of the SO-101 arm performing pick and place tasks on a table',
        'Cuadrícula animada del brazo SO-101 haciendo tareas de coger y colocar sobre una mesa',
        'best_moments_grid-still.jpg',
      ),
      video('erh-demo', 'CDUgXpPN3KQ', 'ERH Physical AI Hackathon - Recording demonstrations until 5 am', 'ERH Physical AI Hackathon: grabando demostraciones hasta las 5 de la mañana'),
    ],
  },
  {
    id: 'go2-inspection',
    model: 'go2',
    title: L('Autonomous Inspection and Companion Unitree Go2', 'Inspección autónoma y compañía con un Unitree Go2'),
    subtitle: L('Europe Embodied 48H Hackathon', 'Hackathon de 48 h Europe Embodied'),
    description: L(
      'Developed an autonomous inspection and human–robot interaction prototype using a Unitree Go2. The system combined VLM-based task planning, Nav2 autonomous navigation and speech-based interaction to support operators in exploring and inspecting industrial environments.',
      'Desarrollo de un prototipo de inspección autónoma e interacción humano-robot con un Unitree Go2. El sistema combinaba planificación de tareas con un VLM, navegación autónoma con Nav2 e interacción por voz para ayudar a los operarios a explorar e inspeccionar entornos industriales.',
    ),
    media: [
      image(
        'eeq1.jpg',
        'Unitree Go2 quadruped robot standing on a cardboard box',
        'Robot cuadrúpedo Unitree Go2 de pie sobre una caja de cartón',
      ),
    ],
  },
  {
    id: 'car',
    model: 'humblebeev2',
    title: L('Teleoperated Car', 'Coche teledirigido'),
    description: L('Development of a teleoperated car.', 'Desarrollo de un coche teledirigido.'),
    media: [
      image(
        'rcv1.jpg',
        'Transparent-bodied car prototype with yellow wheels and exposed electronics',
        'Prototipo de coche con carrocería transparente, ruedas amarillas y electrónica a la vista',
      ),
      image(
        'rcv2.jpg',
        '3D-printed blue car body with large wheels',
        'Carrocería azul impresa en 3D con ruedas grandes',
      ),
      image(
        'rc3.jpg',
        'Car with a bright light switched on, next to a joystick controller on a tiled floor',
        'Coche con una luz brillante encendida, junto a un mando con joystick sobre un suelo de baldosas',
      ),
      video('car-esp32', 'l9EiiZqZ7Z4', 'Teleoperated Car - Esp32 camera web server video', 'Coche teleoperado: vídeo del servidor web de la cámara Esp32'),
    ],
  },
]

// The event itself. What was built there, with its robot, is under `projects`.
export const hackathons = [
  {
    id: 'erh',
    title: L('European Robotics House Physical AI Hackathon', 'European Robotics House Physical AI Hackathon'),
    role: L('2nd place, Black Forest Labs track', '2.º puesto, track de Black Forest Labs'),
    organization: 'Zurich',
    dates: L('Oct 2026', 'Oct 2026'),
    description: L(
      'Physical AI hackathon at the European Robotics House, where our team worked on robot manipulation in the Black Forest Labs track.',
      'Hackathon de Physical AI en la European Robotics House, donde nuestro equipo trabajó en manipulación robótica dentro del track de Black Forest Labs.',
    ),
    media: [
      image(
        'erh_hack_podium.jpg',
        'Group photo of six people at the hackathon awards',
        'Foto de grupo de seis personas en la entrega de premios del hackathon',
      ),
      image(
        'erh_house.jpg',
        'Justo standing next to a humanoid robot at the European Robotics House',
        'Justo de pie junto a un robot humanoide en la European Robotics House',
      ),
      image(
        'erh_hack_team.jpg',
        'Team of three people next to the blue SO-101 arms on their work table',
        'Equipo de tres personas junto a los brazos SO-101 azules en su mesa de trabajo',
      ),
    ],
  },
  {
    id: 'embodied',
    title: L('Europe Embodied — 48h Hackathon', 'Europe Embodied — Hackathon de 48 h'),
    subtitle: L('Wendy Challenge', 'Wendy Challenge'),
    organization: 'Munich',
    dates: L('Jun 2026', 'Jun 2026'),
    description: L(
      '48-hour robotics hackathon in Munich, where our team took part in the Wendy Challenge on factory inspection with a quadruped robot.',
      'Hackathon de robótica de 48 horas en Múnich, donde nuestro equipo participó en el Wendy Challenge sobre inspección de fábricas con un robot cuadrúpedo.',
    ),
    media: [
      image(
        'ee1.jpg',
        'Justo working closely on a project between cardboard boxes and metal shelves',
        'Justo trabajando de cerca en un proyecto entre cajas de cartón y estanterías metálicas',
      ),
      image(
        'ee2.jpg',
        'Justo presenting and gesturing behind a laptop, with cardboard boxes behind him',
        'Justo presentando y gesticulando tras un portátil, con cajas de cartón detrás',
      ),
    ],
  },
  {
    id: 'ai',
    title: L('AI Hackathon', 'AI Hackathon'),
    dates: L('Apr 2026', 'Abr 2026'),
    description: L(
      'Image classification model fine-tuning and Atari Boxing agent training.',
      'Ajuste fino de un modelo de clasificación de imágenes y entrenamiento de un agente para Atari Boxing.',
    ),
    media: [
      image(
        'hackatonaiayo.jpg',
        'Justo speaking next to a desk in front of a banner',
        'Justo hablando junto a una mesa delante de un cartel',
      ),
      image(
        'atari_aia.jpg',
        'Projection of an Atari game next to code during a presentation',
        'Proyección de un juego de Atari junto a código durante una presentación',
      ),
      image(
        'aia_conf.png',
        'Confusion matrix of the image classification model',
        'Matriz de confusión del modelo de clasificación de imágenes',
      ),
    ],
  },
  {
    id: 'mapfre',
    title: L('Mapfre Hackathon', 'Mapfre Hackathon'),
    dates: L('Jul 2025', 'Jul 2025'),
    description: L('Mental Health Care App.', 'Aplicación para el cuidado de la salud mental.'),
    media: [
      image(
        'urjchackaton1.jpg',
        'Group of five participants standing in front of the hackathon banner',
        'Grupo de cinco participantes de pie delante del cartel del hackathon',
      ),
      image(
        'urjchackaton2.jpg',
        'Team working on laptops at a table in a lecture hall',
        'Equipo trabajando con portátiles en una mesa de un aula',
      ),
      image(
        'mapfreapp1.png',
        'Home screen of the mobile app',
        'Pantalla de inicio de la aplicación móvil',
      ),
    ],
  },
  {
    id: 'qubic',
    title: L('Qubic and Vottun Hackathon', 'Hackathon de Qubic y Vottun'),
    dates: L('Mar 2025', 'Mar 2025'),
    description: L('Crypto QR Transfers.', 'Transferencias de criptomonedas mediante códigos QR.'),
    media: [
      image(
        'qubichackaton.jpg',
        'Five participants posing in front of the Vottun and Qubic banners',
        'Cinco participantes posando delante de los carteles de Vottun y Qubic',
      ),
      image(
        'demoqubic1.jpg',
        'App welcome screen asking the user to connect a wallet',
        'Pantalla de bienvenida de la aplicación pidiendo conectar una wallet',
      ),
      image(
        'demoqubic2.jpg',
        'App screen with a personal QR code and recent activity',
        'Pantalla de la aplicación con un código QR personal y la actividad reciente',
      ),
    ],
  },
  {
    id: 'openred',
    title: L('Openred Hackathon', 'Openred Hackathon'),
    dates: L('Feb 2025', 'Feb 2025'),
    description: L(
      'Gamma radiation data collection and upload to a database.',
      'Recopilación de datos de radiación gamma y su subida a una base de datos.',
    ),
    media: [
      image(
        'radiacodehackaton.jpg',
        'Four people posing with a hackathon prize cheque',
        'Cuatro personas posando con el cheque de premio del hackathon',
      ),
      image(
        'radiacodeapp1.png',
        'App showing counts per second, dose, temperature and GPS readings',
        'Aplicación que muestra lecturas de cuentas por segundo, dosis, temperatura y GPS',
      ),
    ],
  },
]

// Education has no photos yet: add them to `media` when they are available.
export const education = [
  {
    id: 'urjc',
    title: L('Universidad Rey Juan Carlos', 'Universidad Rey Juan Carlos'),
    role: L('B.Sc. Robotics Software Engineering', 'Grado en Ingeniería de Robótica Software'),
    dates: L('2023 – Present', '2023 – Actualidad'),
    description: L(
      'Focus on control, robot software architecture, embedded systems and programming (ROS 2, C++).',
      'Formación centrada en control, arquitectura de software para robots, sistemas embebidos y programación (ROS 2, C++).',
    ),
    media: [],
  },
  {
    id: 'ist',
    title: L('Instituto Superior Técnico', 'Instituto Superior Técnico'),
    role: L(
      'Erasmus Exchange Student, MSc Electrical and Computer Engineering',
      'Estudiante de intercambio Erasmus, MSc Electrical and Computer Engineering',
    ),
    dates: L('Sept 2025 – Feb 2026', 'Sept 2025 – Feb 2026'),
    description: L(
      'Erasmus exchange semester at Instituto Superior Técnico, where I studied courses from the MSc in Electrical and Computer Engineering focusing on robotics.',
      'Semestre de intercambio Erasmus en el Instituto Superior Técnico, donde cursé asignaturas del máster en Electrical and Computer Engineering, con especial atención a la robótica.',
    ),
    media: [],
  },
  {
    id: 'uestc',
    title: L(
      'University of Electronic Science and Technology of China (UESTC)',
      'University of Electronic Science and Technology of China (UESTC)',
    ),
    role: L('SMEE International Summer School', 'SMEE International Summer School'),
    dates: L('July 2026', 'Julio 2026'),
    description: L(
      'International summer school focused on creativity, robots and future technologies, mechatronics, robotics and automation engineering.',
      'Escuela internacional de verano centrada en creatividad, robots y tecnologías del futuro, mecatrónica, robótica e ingeniería de automatización.',
    ),
    media: [],
  },
]

// Sections with one entry at a time. The order of the page and of the rail is set in
// App.jsx and stations.js.
export const carouselSections = [
  { id: 'research', entries: research },
  { id: 'responsibility', entries: responsibility },
  { id: 'projects', entries: projects },
  { id: 'hackathons', entries: hackathons },
  { id: 'education', entries: education },
]
