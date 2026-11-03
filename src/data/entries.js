import { L, image, video } from './media.js'

// Media order matches the original portfolio: public deep links and the links
// in the CV (#section/entry/media) depend on it. Do not reorder.

export const experience = [
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
      video('scara-demo', '4r0j4g5fImk', 'RoboTech SCARA Robot Autonomously playing 3 in Line'),
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
    role: L('Autonomous Systems Member — Mapping Responsible', 'Miembro de Sistemas Autónomos — Responsable de Mapping'),
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
      video('tsb-mapping', '_bkvL-_BGiE', 'Mapping Test 02'),
    ],
  },
]

export const projects = [
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
      video('coco-icra', 'cN7WDKmJhnM', 'Quadruped Locomotion under Actuation Uncertainty - ICRA 2027 Submission'),
      video('coco-control', '6V8-M2vEC8k', 'Coco mov control v2.0'),
      video('coco-redesign', 'yG2TFrFOs4w', 'COCO body redesign, AI-generated illustrative video', { autoplay: true }),
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
      video('coco-ik', '99Eip2nVok4', 'Coco Quadruped Robot Inverse Kinematics rotation of body frame test'),
      video('coco-trot', '0X7ajcaga7c', 'Coco Quadruped - Trot Gait Test'),
      image(
        'rpycoco.png',
        'Sequence of photos of the black quadruped showing roll, pitch and yaw body poses',
        'Secuencia de fotos del cuadrúpedo negro mostrando posturas de roll, pitch y yaw',
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
      video('car-esp32', 'l9EiiZqZ7Z4', 'Autonomous Car - Esp32 camera web server video'),
    ],
  },
]

export const hackathons = [
  {
    id: 'erh',
    model: 'so101',
    title: L('European Robotics House Physical AI Hackathon', 'European Robotics House Physical AI Hackathon'),
    description: L(
      'Teaching a LeRobot SO-101 arm to tidy a messy table using the FLUX 3 Action World Action Model.',
      'Enseñar a un brazo LeRobot SO-101 a ordenar una mesa desordenada mediante el modelo FLUX 3 Action World Action Model.',
    ),
    media: [
      image(
        'erh_hack_podium.jpg',
        'Group photo of six people at the hackathon awards',
        'Foto de grupo de seis personas en la entrega de premios del hackathon',
      ),
      image(
        'best_moments_grid.gif',
        'Animated grid of the SO-101 arm performing pick and place tasks on a table',
        'Cuadrícula animada del brazo SO-101 haciendo tareas de coger y colocar sobre una mesa',
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
      video('erh-demo', 'CDUgXpPN3KQ', 'ERH Physical AI Hackathon - Recording demonstrations until 5 am'),
    ],
  },
  {
    id: 'embodied',
    model: 'go2',
    title: L('Europe Embodied — 48h Hackathon', 'Europe Embodied — Hackathon de 48 h'),
    subtitle: L('Wendy Challenge', 'Wendy Challenge'),
    description: L(
      'Quadruped robot autonomous navigation and human-robot interaction for factory inspection.',
      'Navegación autónoma con un robot cuadrúpedo e interacción humano-robot para inspección en fábricas.',
    ),
    credit: {
      text: L(
        '3D model: "Robot dog Unitree Go2" by C. Yamahata, CC BY 4.0 (adapted: legs posed)',
        'Modelo 3D: "Robot dog Unitree Go2" de C. Yamahata, CC BY 4.0 (adaptado: patas flexionadas)',
      ),
      url: 'https://sketchfab.com/3d-models/robot-dog-unitree-go2-7af84eb9ba834f27bbac818a8b96e2da',
    },
    media: [
      image(
        'ee1.jpg',
        'Justo working closely on a project between cardboard boxes and metal shelves',
        'Justo trabajando de cerca en un proyecto entre cajas de cartón y estanterías metálicas',
      ),
      image(
        'eeq1.jpg',
        'Unitree Go2 quadruped robot standing on a cardboard box',
        'Robot cuadrúpedo Unitree Go2 de pie sobre una caja de cartón',
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
    model: null,
    title: L('AI Hackathon', 'AI Hackathon'),
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
    model: null,
    title: L('Mapfre Hackathon', 'Mapfre Hackathon'),
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
    id: 'openred',
    model: null,
    title: L('Openred Hackathon', 'Openred Hackathon'),
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
  {
    id: 'qubic',
    model: null,
    title: L('Qubic and Vottun Hackathon', 'Hackathon de Qubic y Vottun'),
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
]

// Education has no photos yet: add them to `media` when they are available.
export const education = [
  {
    id: 'urjc',
    model: null,
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
    model: null,
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
    model: null,
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

export const carouselSections = [
  { id: 'experience', entries: experience },
  { id: 'projects', entries: projects },
  { id: 'hackathons', entries: hackathons },
  { id: 'education', entries: education },
]
