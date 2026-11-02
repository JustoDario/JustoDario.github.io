import { L } from './media.js'

export const profile = {
  name: 'Justo Dario Valverde Torres',
  photo: {
    file: 'mylatestphoto.jpg',
    alt: L(
      'Justo Dario Valverde, arms crossed, wearing a navy polo shirt outdoors',
      'Justo Dario Valverde con los brazos cruzados y un polo azul marino, al aire libre',
    ),
  },
  subtitle: L(
    'Robotics Software Engineering Student at Universidad Rey Juan Carlos',
    'Estudiante de Ingeniería Robótica Software en la Universidad Rey Juan Carlos',
  ),
  tagline: L(
    'Passionate about robotics, programming and real-world solutions',
    'Apasionado por la robótica, la programación y las soluciones reales',
  ),
  cv: 'assets/CVJustoDario.pdf',
  github: 'https://github.com/JustoDario',
  linkedin: 'https://www.linkedin.com/in/justodariovalverde/',
  email: 'justodariovalverde@gmail.com',
  about: [
    L(
      "Hi, I'm Justo, a Robotics Software Engineering student passionate about building real robots and learning how autonomous systems work in practice. I'm always looking for hands-on opportunities involving mapping, perception and robot control.",
      'Hola, soy Justo, estudiante de Ingeniería Robótica Software y apasionado por construir robots reales y aprender cómo funcionan los sistemas autónomos en la práctica. Siempre busco oportunidades prácticas en mapping, percepción y control de robots.',
    ),
    L(
      'I currently lead the SCARA project at RoboTech (URJC Student Association), where my team and I aim to build an autonomous chess-playing robot; it currently plays three in line. I have also been designing and building a quadruped robot from scratch as a personal project.',
      'Actualmente lidero el proyecto SCARA en RoboTech (asociación de estudiantes de la URJC), donde mi equipo y yo buscamos construir un robot capaz de jugar al ajedrez de forma autónoma; de momento juega al 3 en raya. Además, diseño y construyo un robot cuadrúpedo desde cero como proyecto personal.',
    ),
    L(
      'I have submitted a first-author paper to IEEE ICRA 2027 on reactive locomotion control for low-cost quadrupeds, based on my latest personal project: a servo-actuated quadruped "robot cat". The decision is still pending.',
      'He enviado a IEEE ICRA 2027, como primer autor, un paper sobre control reactivo de locomoción para cuadrúpedos de bajo coste, basado en mi proyecto personal más reciente: un "robot gato" cuadrúpedo accionado por servomotores. La decisión aún está pendiente.',
    ),
    L(
      'Outside robotics, I enjoy hands-on building, boxing, fishing, video games, creative 3D design and international experiences.',
      'Fuera de la robótica, me gustan los proyectos prácticos, el boxeo, la pesca, los videojuegos, el diseño 3D creativo y las experiencias internacionales.',
    ),
  ],
}

export const skills = [
  { name: 'ROS 2', logo: 'ros2logo.png' },
  { name: 'C++', logo: 'cpp-logo.png' },
  { name: 'Foxglove', logo: 'foxglovelogo.png' },
  { name: 'Python', logo: 'pythonlogo.jpg' },
  { name: 'ROS 2 Control', logo: 'ros2controllogo.png' },
  { name: 'Gazebo', logo: 'gazebologo.png' },
]
