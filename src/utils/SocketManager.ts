import { io, Socket } from "socket.io-client";

// Type definitions for socket events
interface AuthenticationData {
  userId: string;
  token: string;
}

interface AuthenticatedResponse {
  success: boolean;
  message?: string;
  userId?: string;
}

interface AuthError {
  error: string;
  message: string;
}

interface UploadProgressData {
  uploadId: string;
  filename: string;
  totalSize: number;
  uploadedSize: number;
  percentage: number;
  currentChunk: number;
  totalChunks: number;
  status: "initializing" | "uploading" | "completed" | "failed" | "paused";
  error?: string;
}

interface UploadCompleteData {
  uploadId: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
}

interface UploadErrorData {
  uploadId: string;
  error: string;
  message: string;
}

type SocketEventCallbacks = {
  "upload-progress": (data: UploadProgressData) => void;
  "upload-complete": (data: UploadCompleteData) => void;
  "upload-error": (data: UploadErrorData) => void;
};

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private connectionPromise: Promise<Socket> | null = null;
  private isConnecting = false;

  private constructor() {}

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  async getConnection(): Promise<Socket> {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    if (this.isConnecting && this.connectionPromise) {
      return this.connectionPromise;
    }

    this.isConnecting = true;
    this.connectionPromise = this.createConnection();

    try {
      this.socket = await this.connectionPromise;
      return this.socket;
    } finally {
      this.isConnecting = false;
      this.connectionPromise = null;
    }
  }

  private createConnection(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      const socket = io(
        import.meta.env.VITE_API_LOCAL_URL || "http://localhost:8080",
        {
          transports: ["websocket", "polling"],
          timeout: 20000,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        }
      );

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);

        // Authenticate with user token
        const token = localStorage.getItem("token") || "";
        const userId = localStorage.getItem("userId") || "";

        if (token && userId) {
          const authData: AuthenticationData = { userId, token };
          socket.emit("authenticate", authData);
        }

        resolve(socket);
      });

      socket.on("connect_error", (error: Error) => {
        console.error("Socket connection error:", error);
        reject(error);
      });

      socket.on("disconnect", (reason: string) => {
        console.log("Socket disconnected:", reason);
        if (reason === "io server disconnect") {
          // Server disconnected, reconnect manually
          socket.connect();
        }
      });

      socket.on("authenticated", (data: AuthenticatedResponse) => {
        console.log("Socket authenticated:", data);
      });

      socket.on("auth_error", (error: AuthError) => {
        console.error("Socket authentication error:", error);
        // Handle auth error - maybe redirect to login
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribeToUploadProgress(
    uploadId: string,
    callback: (data: UploadProgressData) => void
  ): void {
    if (this.socket) {
      this.socket.emit("subscribe-upload-progress", uploadId);
      this.socket.on("upload-progress", callback);
    }
  }

  unsubscribeFromUploadProgress(
    uploadId: string,
    callback: (data: UploadProgressData) => void
  ): void {
    if (this.socket) {
      this.socket.emit("unsubscribe-upload-progress", uploadId);
      this.socket.off("upload-progress", callback);
    }
  }

  onUploadComplete(callback: (data: UploadCompleteData) => void): void {
    if (this.socket) {
      this.socket.on("upload-complete", callback);
    }
  }

  onUploadError(callback: (data: UploadErrorData) => void): void {
    if (this.socket) {
      this.socket.on("upload-error", callback);
    }
  }

  removeUploadListeners<K extends keyof SocketEventCallbacks>(callbacks: {
    [key in K]: SocketEventCallbacks[K];
  }): void {
    if (this.socket) {
      Object.entries(callbacks).forEach(([event, callback]) => {
        this.socket!.off(event, callback as (...args: unknown[]) => void);
      });
    }
  }

  cancelUpload(uploadId: string): void {
    if (this.socket) {
      this.socket.emit("cancel-upload", uploadId);
    }
  }
}

export default SocketManager;
