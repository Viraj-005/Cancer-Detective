import { useState } from 'react';
import { FaQuestionCircle, FaCommentDots, FaBug, FaLightbulb, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ContactFeedback.css';
import contactImage from '../assets/contact.png';

const ContactFeedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjectOptions = [
    { value: 'General Inquiry', icon: <FaQuestionCircle />, color: '#007bff' },
    { value: 'Feedback', icon: <FaCommentDots />, color: '#28a745' },
    { value: 'Bug Report', icon: <FaBug />, color: '#dc3545' },
    { value: 'Feature Request', icon: <FaLightbulb />, color: '#ffc107' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/contact/contact-feedback/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(`Your ${formData.subject.toLowerCase()} has been sent successfully!`);
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      } else {
        toast.error('Failed to send the message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while sending the message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubjectStyle = (subject) => {
    const selectedSubject = subjectOptions.find(opt => opt.value === subject);
    return {
      borderColor: selectedSubject.color,
      color: selectedSubject.color
    };
  };

  return (
    <motion.div 
      className="contact-feedback-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover />
      
      <motion.div 
        className="contact-image-container"
        variants={itemVariants}
      >
        <motion.img 
          src={contactImage} 
          alt="Contact" 
          className="contact-image"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>

      <motion.div 
        className="contact-form-container"
        variants={itemVariants}
      >
        <motion.h1 variants={itemVariants}>Contact Us & Feedback</motion.h1>
        <motion.form 
          onSubmit={handleSubmit} 
          className="contact-form"
          variants={containerVariants}
        >
          <motion.div className="contact-input" variants={itemVariants}>
            <input
              type="text"
              name="name"
              placeholder="Your Name (Optional)"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email (Optional)"
              value={formData.email}
              onChange={handleChange}
            />
          </motion.div>

          <motion.div 
            className="contact-subject-select" 
            style={getSubjectStyle(formData.subject)}
            variants={itemVariants}
          >
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="contact-select"
            >
              {subjectOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
            <AnimatePresence mode="wait">
              <motion.div
                key={formData.subject}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {subjectOptions.find(opt => opt.value === formData.subject)?.icon}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.textarea
            variants={itemVariants}
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            className="contact-textarea"
            required
          />

          <motion.button
            type="submit"
            className="contact-button"
            disabled={isSubmitting}
            variants={itemVariants}
          >
            {isSubmitting ? (
              <div className="submitting-content">
                <FaSpinner className="spinner-icon" />
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit'
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default ContactFeedback;