import axios from "axios";

const KAFKA_URL = 'http://localhost:8080';

export const startBroker = async (id) => {
    try {
        console.log("startBroker", id);
        const response = await axios.post(`${KAFKA_URL}/broker/start/${id}`, {});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const shutDownBroker = async (id) => {
    try {
        console.log("shutDownBroker", id);
        const response = await axios.post(`${KAFKA_URL}/broker/shutdown/${id}`, {});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const statusBroker = async (id) => {
    try {
        console.log("statusBroker", id);
        const response = await axios.post(`${KAFKA_URL}/broker/status/${id}`, {});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const startController = async (id) => {
    try {
        const response = await axios.post(`${KAFKA_URL}/control/start/${id}`, {});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const shutDownController = async (id) => {
    try {
        const response = await axios.post(`${KAFKA_URL}/control/shutdown/${id}`, {});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const statusController = async (id) => {
    try {
        const response = await axios.post(`${KAFKA_URL}/control/status/${id}`, {});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const startConnect = async (id) => {
    try {
        const response = await axios.post(`${KAFKA_URL}/connect/start/${id}`, {});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const shutDownConnect = async (id) => {
    try {
        const response = await axios.post(`${KAFKA_URL}/connect/shutdown/${id}`, {});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const statusConnect = async (id) => {
    try {
        const response = await axios.post(`${KAFKA_URL}/connect/status/${id}`, {});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const statusConnector = async (id, connectorType) => {
    try {
        const response = await axios.post(`${KAFKA_URL}/status/${id}/${connectorType}`, {});
        return response.data;
    } catch (error) {
        throw error;
    }
}