class DetectionService {
    constructor() {
        this.baseUrl = 'http://127.0.0.1:8000/api/detect/cancer';
        this.isPreloaded = false;
    }

    async preloadConnection() {
        if (this.isPreloaded) return;

        try {
            // Make a minimal HEAD request to warm up the connection
            const response = await fetch(`${this.baseUrl}/leukemia/`, {
                method: 'OPTIONS',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                this.isPreloaded = true;
                return true;
            }
            return false;
        } catch (error) {
            console.warn('Preload connection failed:', error);
            return false;
        }
    }

    async detectCancer(file, cancerType) {
        // Don't wait for preload on actual detection requests
        // Just make the detection request directly
        const formData = new FormData();
        formData.append("file", file);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        try {
            const response = await fetch(`${this.baseUrl}/${cancerType}/`, {
                method: "POST",
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Detection failed');
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }
}

export const detectionService = new DetectionService();