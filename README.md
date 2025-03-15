# ![Cancer Detective Logo](assets/CDLoogo.svg)

# Cancer Detective Web App 🩺🔬

**A Final Year Project for Early Cancer Detection using AI**

🚀 **Cancer Detective** is an AI-powered web application designed to assist in the **early detection of Leukemia, Lung Cancer, and Skin Cancer** through medical image analysis. This web-based tool utilizes deep learning models to classify cancerous and non-cancerous images, offering real-time diagnostic predictions.

---

## 📌 Features

✅ **AI-Based Detection**: Utilizes **VGG16, EfficientNetB4, and EfficientNetB3** models for accurate classification.  
✅ **User Authentication**: Google OAuth and manual login options.  
✅ **Fast & Secure**: Runs on **FastAPI and Django**, ensuring quick and reliable predictions.  
✅ **Data Privacy**: No medical images are stored, adhering to **HIPAA & GDPR** compliance.  
✅ **User-Friendly UI**: Built with **React.js** for seamless navigation.  
✅ **Multi-Cancer Detection**: Supports analysis for **Leukemia, Lung Cancer, and Skin Cancer**.  
✅ **Medical Recommendations**: Provides preliminary health advice based on detection results.  
✅ **Deployed on AWS**: Utilizes **AWS Lambda** for scalable and efficient inference.

---

## 📸 Screenshots

| Home Page | Detection Page | Results Page |
|-----------|--------------|--------------|
| ![Home Page](path/to/homepage.png) | ![Detection Page](path/to/detection.png) | ![Results](path/to/results.png) |

---

## 🚀 Installation Guide

### Prerequisites
- Python 3.8+
- Node.js & npm
- Git

### Clone the Repository
```sh
git clone https://github.com/your-username/cancer-detective-webapp.git
cd cancer-detective-webapp
```

### Backend Setup (FastAPI & Django)
```sh
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup (React.js)
```sh
cd frontend
npm install
npm run dev
```

---

## 🖥️ Usage
1. **Sign in** using Google OAuth or register manually.
2. **Upload a medical image** of blood smear, lung tissue, or skin lesion.
3. The AI model **analyzes the image** and provides real-time results.
4. View **detection results** along with medical recommendations.
5. **Download the report** for future reference.

---

## 🔒 Data Security & Compliance
✅ **HIPAA & GDPR Compliant**: Ensures patient data privacy.  
✅ **Encrypted Communications**: All data transmissions use **HTTPS**.  
✅ **No Image Storage**: Uploaded images are deleted after processing.  

---

## 🌟 Future Enhancements
- **Mobile App Development** (React Native)
- **Real-Time Model Optimization**
- **Federated Learning for Data Privacy**

---

## 💡 Contributors
**Viraj Induruwa**  
**Supervisor**: Mr. Isuru Samarappulige

---

## 📜 License
MIT License © 2025 Sangeeth Induruwa

---

## ⭐ Show Your Support
If you like this project, don't forget to **star** ⭐ the repository on GitHub!
