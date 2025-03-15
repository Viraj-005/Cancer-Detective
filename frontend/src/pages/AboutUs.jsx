import { FaBrain, FaUserMd, FaRobot, FaHeartbeat, FaGlobe, FaLightbulb } from 'react-icons/fa';
import '../styles/AboutUs.css';

function AboutUs() {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Cancer Detective</h1>
        <p>Empowering Early Cancer Detection Through Advanced Technology</p>
      </div>

      <div className="about-content">
        {/* Mission Section */}
        <div className="about-mission">
          <FaHeartbeat className="about-icon" aria-label="Heart icon" />
          <h2>Our Mission</h2>
          <p>
            Cancer Detective is dedicated to leveraging cutting-edge artificial intelligence 
            to provide accessible, accurate, and early cancer detection services. 
            Our goal is to increase survival rates by enabling early identification of 
            potential cancer indicators.
          </p>
        </div>

        {/* Team Section */}
        <div className="about-team">
          <FaUserMd className="about-icon" aria-label="Doctor icon" />
          <h2>Our Team</h2>
          <p>
            Our multidisciplinary team comprises medical professionals, data scientists, 
            and AI researchers committed to developing innovative solutions in cancer diagnostics.
          </p>
        </div>

        {/* Technology Section */}
        <div className="about-technology">
          <FaRobot className="about-icon" aria-label="Robot icon" />
          <h2>Our Technology</h2>
          <p>
            Utilizing advanced machine learning algorithms and deep neural networks, 
            we analyze medical images with unprecedented precision. Our models are 
            trained on extensive medical datasets to provide reliable preliminary diagnoses.
          </p>
        </div>

        {/* Innovation Section */}
        <div className="about-innovation">
          <FaBrain className="about-icon" aria-label="Brain icon" />
          <h2>Innovative Approach</h2>
          <p>
            We constantly innovate, combining the latest advancements in AI research with real-world applications, 
            ensuring that we stay at the forefront of cancer detection technology.
          </p>
        </div>

        {/* Vision Section */}
        <div className="about-vision">
          <FaLightbulb className="about-icon" aria-label="Lightbulb icon" />
          <h2>Our Vision</h2>
          <p>
            We envision a world where cancer is detected early, treated effectively, and survival rates 
            are significantly improved. By combining human expertise and AI technology, 
            we aim to make a transformative impact on global healthcare.
          </p>
        </div>

        {/* Global Impact Section */}
        <div className="about-global-impact">
          <FaGlobe className="about-icon" aria-label="Globe icon" />
          <h2>Global Impact</h2>
          <p>
            Cancer Detective is not just about technology - its about making a difference. 
            Our solutions are designed to be accessible and scalable, enabling healthcare 
            providers worldwide to detect cancer earlier and save more lives.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
