import { Link } from 'react-router-dom';
import { FaSyringe, FaHeart, FaLeaf, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/HomePage.css';
import doctorImage from '../assets/doctor.png';

function HomePage() {
  const features = [
    {
      title: "Leukemia Detection",
      description: "Advanced blood cell analysis with precision machine learning",
      icon: <FaSyringe />,
      link: "/detection#leukemia"
    },
    {
      title: "Lung Cancer Detection",
      description: "Comprehensive histopathological images interpretation",
      icon: <FaHeart />,
      link: "/detection#lung"
    },
    {
      title: "Skin Cancer Detection",
      description: "Detailed dermatological image scanning technology",
      icon: <FaLeaf />,
      link: "/detection#skin"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="home-enhanced">
      <motion.div 
        className="hero-section container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Early Cancer Detection,
            <br />Powered by AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Revolutionizing healthcare through intelligent,
            accessible medical image analysis
          </motion.p>
          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to="/detection" className="btn btn-primary">
              Start Detection
            </Link>
            <Link to="/how-it-works" className="btn btn-secondary">
              Learn More
            </Link>
          </motion.div>
        </div>
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="medical-graph"></div>
          <motion.img
            src={doctorImage || 'https://via.placeholder.com/400'}
            alt="Doctor"
            className="doctor-image"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </motion.div>
      </motion.div>

      <motion.div 
        className="features-section container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 style={{ color: 'white' }}>Our Detection Capabilities</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className="feature-action">
                <Link to={feature.link} className="btn btn-try-now">
                  Try Now
                  <FaArrowRight style={{ marginLeft: '8px' }} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="extra-content"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="text-ani">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Why Choose Our Service?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            We leverage cutting-edge AI technology to provide accurate, 
            fast, and accessible early cancer detection. Our system is 
            designed to be user-friendly, scalable, and reliable, ensuring 
            that patients get the best possible care.
            <strong> 100% free AI-powered app </strong> to make advanced healthcare accessible to everyone.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

export default HomePage;