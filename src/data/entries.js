import { L, image, video } from './media.js'

// The order of `media` is public: deep links and the links in the CV (#section/entry/media)
// depend on it. Reordering means updating them.

export const research = [
  {
    id: 'quadruped',
    model: 'coco1',
    title: L('12-DOF ROS 2 Quadruped Robot — COCO', 'Robot cuadrúpedo ROS 2 de 12 GDL — COCO'),
    description: L(
      'Designed and built a 12-DOF quadruped robot from scratch, covering electronics, CAD, 3D printing and the ROS 2 control architecture.',
      'Diseño y construcción desde cero de un robot cuadrúpedo de 12 GDL, incluyendo electrónica, CAD, impresión 3D y la arquitectura de control en ROS 2.',
    ),
    highlights: [
      L(
        'Identified hardware limitations in the initial design, particularly an off-centred centre of mass and servo backlash.',
        'Identificación de limitaciones de hardware en el diseño inicial, en particular un centro de masas descentrado y el backlash de los servos.',
      ),
      L(
        'Developed a reactive single-step horizon control pipeline to compensate for actuation uncertainty.',
        'Desarrollo de un pipeline de control reactivo de horizonte de un solo paso para compensar la incertidumbre de actuación.',
      ),
      L(
        'Resulted in a first-author manuscript submitted to ICRA 2027.',
        'Dio lugar a un manuscrito como primer autor enviado a ICRA 2027.',
      ),
      L(
        'Presented at the Europe Embodied Summit 2026 in Munich.',
        'Presentado en el Europe Embodied Summit 2026 de Múnich.',
      ),
    ],
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
  {
    id: 'thesis',
    model: 'g1',
    title: L(
      "Bachelor's Thesis: Integration of Foundation Models with Hierarchical Whole-Body Control for Generalist and Safe Humanoid Loco-Manipulation",
      'TFG: Integración de modelos fundacionales con Whole-Body Control jerárquico para loco-manipulación humanoide generalista y segura',
    ),
    role: L('Supervisor: Francisco Martín Rico, URJC', 'Tutor: Francisco Martín Rico, URJC'),
    dates: L('Sep 2026 – Present', 'Sep 2026 – Actualidad'),
    note: L(
      'Platform: Unitree R1 humanoid robot. The 3D model shown is a Unitree G1, for illustration.',
      'Plataforma: robot humanoide Unitree R1. El modelo 3D mostrado es un Unitree G1, a modo ilustrativo.',
    ),
    description: L(
      'Exploring the integration of foundation-model architectures, including Vision-Language-Action (VLA) models, World Action Models (WAMs) and Video Action Models (VAMs), into humanoid loco-manipulation. The approach aims to leverage their generalisation capabilities for high-level manipulation and motion generation, translating model outputs into intermediate task-space and body-pose objectives handled by a hierarchical Whole-Body Control (WBC) framework. This framework acts as a feasibility-aware execution and safety layer, coordinating whole-body motion while accounting for physical constraints and dynamic balance.',
      'Exploración de la integración de arquitecturas de modelos fundacionales, incluidos los Vision-Language-Action (VLA), World Action Models (WAM) y Video Action Models (VAM), en la loco-manipulación humanoide. El enfoque busca aprovechar su capacidad de generalización para la manipulación de alto nivel y la generación de movimiento, traduciendo sus salidas en objetivos intermedios en espacio de tarea y de postura del cuerpo gestionados por un framework jerárquico de Whole-Body Control (WBC). Este framework actúa como capa de ejecución y seguridad consciente de la viabilidad, coordinando el movimiento de todo el cuerpo y teniendo en cuenta las restricciones físicas y el equilibrio dinámico.',
    ),
    media: [],
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
    id: 'scara',
    model: 'scara',
    title: L('SCARA Project Lead', 'Líder del proyecto SCARA'),
    organization: 'RoboTech URJC',
    dates: L('Jan 2025 – Present', 'Ene 2025 – Actualidad'),
    description: L(
      'Leading a student team developing a 4-DOF SCARA robotic arm.',
      'Liderazgo de un equipo de estudiantes que desarrolla un brazo robótico SCARA de 4 GDL.',
    ),
    highlights: [
      L('Implemented forward and inverse kinematics.', 'Implementación de la cinemática directa e inversa.'),
      L(
        'Integrated control, computer vision and decision-making algorithms.',
        'Integración de algoritmos de control, visión por computador y toma de decisiones.',
      ),
      L(
        'Developed an Arduino-based demonstration in which the robot plays Connect-3 against a human.',
        'Desarrollo de una demostración con Arduino en la que el robot juega al 3 en raya contra una persona.',
      ),
      L(
        'Ongoing migration towards ROS 2 and MoveIt, together with an end-effector redesign for the autonomous chess-playing project.',
        'Migración en curso a ROS 2 y MoveIt, junto con el rediseño del efector final para el proyecto de ajedrez autónomo.',
      ),
    ],
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
    id: 'treasurer',
    title: L('Association Treasurer', 'Tesorero de la asociación'),
    organization: 'RoboTech URJC',
    dates: L('Jun 2025 – Present', 'Jun 2025 – Actualidad'),
    description: L(
      "Manage the association's budget and purchasing decisions, supporting project teams through component selection and cost/performance trade-off assessments.",
      'Gestión del presupuesto y las compras de la asociación, ayudando a los equipos de proyecto en la selección de componentes y la valoración de compromisos entre coste y prestaciones.',
    ),
    noMedia: true,
    media: [],
  },
  {
    id: 'tsb',
    model: 'sp01',
    title: L('Autonomous Systems – Mapping Lead', 'Sistemas Autónomos – Mapping Lead'),
    organization: 'Técnico Solar Boat',
    dates: L('Oct 2025 – Apr 2026', 'Oct 2025 – Abr 2026'),
    description: L(
      'Responsible for the mapping implementation within the ROS 2 autonomous navigation stack of the SP01 vessel. Developed an initial LiDAR point-cloud-based OccupancyGrid pipeline and designed a layered GridMap costmap integrating dynamic occupancy updates, obstacle inflation and buoy-constrained navigable corridors based on camera–LiDAR perception.',
      'Responsable de la implementación del mapping en el stack de navegación autónoma en ROS 2 del barco SP01. Desarrollo de un primer pipeline de OccupancyGrid a partir de nubes de puntos LiDAR y diseño de un costmap por capas con GridMap que integra actualizaciones dinámicas de ocupación, inflado de obstáculos y corredores navegables delimitados por boyas a partir de percepción cámara–LiDAR.',
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
    id: 'biped',
    model: 'stairclimber',
    title: L('Biped Stair-Climbing Robot', 'Robot bípedo para subir escaleras'),
    subtitle: L('Mechatronics course project', 'Proyecto de la asignatura de mecatrónica'),
    description: L(
      'Design of a bipedal robot for stair climbing as part of a mechatronics course project, focusing on its mechanical configuration and actuation system.',
      'Diseño de un robot bípedo para subir escaleras en un proyecto de la asignatura de mecatrónica, centrado en su configuración mecánica y su sistema de actuación.',
    ),
    note: L('Details on the mechanical design, actuators, kinematics and control are coming soon.', 'Próximamente, más detalles sobre el diseño mecánico, los actuadores, la cinemática y el control.'),
    media: [],
  },
  {
    id: 'ur5',
    model: 'ur5',
    title: L('Industrial Robot Programming and Motion Control — UR5', 'Programación y control de movimiento de un robot industrial — UR5'),
    description: L(
      'Programming and execution of motion routines using a UR5 industrial manipulator, gaining practical experience with industrial robot control and task programming.',
      'Programación y ejecución de rutinas de movimiento con un manipulador industrial UR5, adquiriendo experiencia práctica en control de robots industriales y programación de tareas.',
    ),
    media: [],
  },
  {
    id: 'delivery',
    model: 'kobuki',
    title: L('Autonomous Delivery Robot — Nav2 and Human-Robot Interaction', 'Robot de reparto autónomo — Nav2 e interacción humano-robot'),
    description: L(
      'Development of an autonomous delivery robot capable of navigating to a specified destination using Nav2. At the destination, the robot communicates with the recipient and requests the delivery password through a human–robot interaction interface. The application involves providing the robot with the recipient, destination and delivery password before starting the delivery task.',
      'Desarrollo de un robot de reparto autónomo capaz de navegar hasta un destino indicado con Nav2. Al llegar, el robot se comunica con el destinatario y le pide la contraseña de entrega mediante una interfaz de interacción humano-robot. Antes de iniciar el reparto se le indican el destinatario, el destino y la contraseña.',
    ),
    media: [],
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
  {
    id: 'line-follower',
    model: 'linefollower',
    title: L('Autonomous Line-Following Robot', 'Robot siguelíneas autónomo'),
    subtitle: L('Introductory Programming course final project', 'Proyecto final de la asignatura de Introducción a la Programación'),
    description: L(
      'Development of a line-following robot for a timed circuit challenge, with the objective of completing the track as quickly as possible while remaining on the designated path.',
      'Desarrollo de un robot siguelíneas para un reto de circuito cronometrado, con el objetivo de completar la pista lo más rápido posible sin salirse del recorrido.',
    ),
    media: [],
  },
  {
    id: 'rover',
    model: 'turtlerover',
    title: L('Mobile Rover Platform with SCARA Arm — CAD and Simulation', 'Plataforma rover con brazo SCARA — CAD y simulación'),
    subtitle: L('Robot Modelling and Simulation course project', 'Proyecto de la asignatura de Modelado y Simulación de Robots'),
    simulated: true,
    description: L(
      'Designed a mobile rover platform equipped with a SCARA manipulator from scratch in 3D, generated its URDF model and integrated it into a ROS 2/Gazebo simulation using ROS 2 Control and MoveIt.',
      'Diseño desde cero en 3D de una plataforma móvil tipo rover con un manipulador SCARA, generación de su modelo URDF e integración en una simulación con ROS 2 y Gazebo usando ROS 2 Control y MoveIt.',
    ),
    media: [],
  },
  {
    id: 'rescue',
    model: 'drone',
    title: L('Autonomous Maritime Search and Rescue', 'Búsqueda y rescate marítimo autónomo'),
    simulated: true,
    description: L(
      'Programming of a simulated rescue drone to autonomously sweep a designated maritime area in search of survivors, in the Unibotics educational simulation environment.',
      'Programación de un dron de rescate simulado para barrer de forma autónoma una zona marítima en busca de supervivientes, en el entorno educativo de simulación Unibotics.',
    ),
    media: [],
  },
  {
    id: 'cleaning',
    model: 'roomba',
    title: L('Autonomous Cleaning Robot — Coverage Planning', 'Robot de limpieza autónomo — Planificación de cobertura'),
    simulated: true,
    description: L(
      'Implementation and evaluation of autonomous coverage algorithms for a simulated cleaning robot tasked with covering an indoor environment, in the Unibotics educational simulation environment.',
      'Implementación y evaluación de algoritmos de cobertura autónoma para un robot de limpieza simulado que debe cubrir un entorno interior, en el entorno educativo de simulación Unibotics.',
    ),
    media: [],
  },
  {
    id: 'parking',
    model: 'robotaxi',
    title: L('LiDAR-Based Autonomous Parking', 'Aparcamiento autónomo con LiDAR'),
    simulated: true,
    description: L(
      'Development of an autonomous parking system for a simulated vehicle using 3D LiDAR perception to navigate and perform the parking manoeuvre, in the Unibotics educational simulation environment.',
      'Desarrollo de un sistema de aparcamiento autónomo para un vehículo simulado que usa percepción con LiDAR 3D para navegar y realizar la maniobra, en el entorno educativo de simulación Unibotics.',
    ),
    media: [],
  },
  {
    id: 'f1',
    model: 'f1car',
    title: L('Learning-Based Autonomous F1 Racing', 'F1 autónomo basado en aprendizaje'),
    simulated: true,
    description: L(
      'Application of machine-learning techniques to control a simulated F1 car, aiming to minimize lap time while keeping the vehicle within track boundaries, in the Unibotics educational simulation environment.',
      'Aplicación de técnicas de machine learning para controlar un F1 simulado, con el objetivo de minimizar el tiempo por vuelta sin salirse de los límites de la pista, en el entorno educativo de simulación Unibotics.',
    ),
    media: [],
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

// Logos and photos go in `media` once they are available.
export const education = [
  {
    id: 'urjc',
    title: L('Universidad Rey Juan Carlos', 'Universidad Rey Juan Carlos'),
    role: L('B.Sc. Robotics Software Engineering', 'Grado en Ingeniería de Robótica Software'),
    organization: 'Madrid, Spain',
    dates: L('Sep 2023 – Expected Jun 2027', 'Sep 2023 – Previsto jun 2027'),
    description: L(
      'Focus on control, robot software architecture, embedded systems and programming (ROS 2, C++).',
      'Formación centrada en control, arquitectura de software para robots, sistemas embebidos y programación (ROS 2, C++).',
    ),
    media: [],
  },
  {
    id: 'ist',
    title: L('Instituto Superior Técnico — Universidade de Lisboa', 'Instituto Superior Técnico — Universidade de Lisboa'),
    role: L('Erasmus+ Exchange Programme', 'Programa de intercambio Erasmus+'),
    organization: 'Lisbon, Portugal',
    dates: L('Sep 2025 – Feb 2026', 'Sep 2025 – Feb 2026'),
    description: L(
      "Undertook MSc-level coursework in Electrical and Computer Engineering, focusing on robotics, during the third year of my Bachelor's degree.",
      'Cursé asignaturas de máster en Electrical and Computer Engineering, centradas en robótica, durante el tercer año del grado.',
    ),
    media: [],
  },
  {
    id: 'uestc',
    title: L(
      'University of Electronic Science and Technology of China (UESTC)',
      'University of Electronic Science and Technology of China (UESTC)',
    ),
    role: L('UESTC 2026 SMEE International Robotics Summer School', 'UESTC 2026 SMEE International Robotics Summer School'),
    organization: 'Chengdu, China',
    dates: L('Jul 2026', 'Jul 2026'),
    description: L(
      'Participated in an international summer programme combining academic lectures, hands-on workshops and industry visits in robotics, artificial intelligence and advanced manufacturing. Explored topics including intelligent robotic systems, Graph Neural Networks, soft robotics, AI applications in renewable energy, and robot design and manufacturing.',
      'Participación en un programa internacional de verano que combina clases, talleres prácticos y visitas a empresas sobre robótica, inteligencia artificial y fabricación avanzada. Temas tratados: sistemas robóticos inteligentes, Graph Neural Networks, robótica blanda, aplicaciones de la IA en energías renovables y diseño y fabricación de robots.',
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
