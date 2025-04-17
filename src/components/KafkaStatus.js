import React, { useEffect, useState } from 'react';
import StatusBox from './StatusBox';
import LogBox from './LogBox';
import ErrorBox from './ErrorBox';
import {
  shutDownBroker,
  shutDownController,
  shutDownConnect,
  startBroker,
  startController,
  startConnect,
  statusBroker,
  statusController,
  statusConnect,
} from '../api/api';

const KafkaStatus = () => {
  const [statusMap, setStatusMap] = useState(
    new Map([['브로커', [true, true, true]], ['컨트롤러', [true, true, true]], ['커넥트', [true, true]]])
  );
  const [loadingMap, setLoadingMap] = useState(
    new Map([['브로커', [false, false, false]], ['컨트롤러', [false, false, false]], ['커넥트', [false, false]]])
  );
  const [logMessages, setLogMessages] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(false);

  const addLogMessage = (message) => {
    setLogMessages((prev) => {
      const updatedLogs = [...prev, `[LOG ${new Date().toLocaleTimeString()}] ${message}`];
      // 로그 메시지 개수가 10개 이상이면 10개만 남기고 잘라내기
      return updatedLogs.slice(-10);
    });
  };

  const addErrorMessage = (message) => {
    setErrorMessages((prev) => {
      const updatedErrors = [...prev, `[ERROR ${new Date().toLocaleTimeString()}] ${message}`];
      // 오류 메시지 개수가 10개 이상이면 10개만 남기고 잘라내기
      return updatedErrors.slice(-10);
    });
  };

  const setLoading = (key, id, value) => {
    const updated = [...loadingMap.get(key)];
    updated[id] = value;
    const newMap = new Map(loadingMap);
    newMap.set(key, updated);
    setLoadingMap(newMap);
  };

  const updateBrokerStatus = async (id) => {
    try {
      const status = await statusBroker(id + 1);
      const current = new Map(statusMap);
      const updated = [...current.get('브로커')];
      updated[id] = status.includes('9092');
      current.set('브로커', updated);
      setStatusMap(current);
      addLogMessage(`브로커 ${id + 1} 상태: ${status.includes('9092') ? '정상' : '비정상'}`);
    } catch (error) {
      addErrorMessage(`브로커 ${id + 1} 상태 확인 실패: ${error.message}`);
    }
  };

  const updateControllerStatus = async (id) => {
    try {
      const status = await statusController(id + 1);
      const current = new Map(statusMap);
      const updated = [...current.get('컨트롤러')];
      updated[id] = status.includes('9093');
      current.set('컨트롤러', updated);
      setStatusMap(current);
      addLogMessage(`컨트롤러 ${id + 1} 상태: ${status.includes('9093') ? '정상' : '비정상'}`);
    } catch (error) {
      addErrorMessage(`컨트롤러 ${id + 1} 상태 확인 실패: ${error.message}`);
    }
  };

  const updateConnectStatus = async (id) => {
    try {
      const status = await statusConnect(id + 1);
      const current = new Map(statusMap);
      const updated = [...current.get('커넥트')];
      updated[id] = status.includes('8083');
      current.set('커넥트', updated);
      setStatusMap(current);
      addLogMessage(`커넥트 ${id + 1} 상태: ${status.includes('8083') ? '정상' : '비정상'}`);
    } catch (error) {
      addErrorMessage(`커넥트 ${id + 1} 상태 확인 실패: ${error.message}`);
    }
  };

  const handleShutdown = async (key, id) => {
    setGlobalLoading(true);
    try {
      setLoading(key, id, true);
      const current = new Map(statusMap);
      const updated = [...current.get(key)];
      updated[id] = false;
      current.set(key, updated);
      setStatusMap(current);

      if (key === '브로커') {
        await shutDownBroker(id + 1);
        addLogMessage(`${key} ${id + 1} 종료됨`);
        setTimeout(() => updateBrokerStatus(id), 5000);
      } else if (key === '컨트롤러') {
        await shutDownController(id + 1);
        addLogMessage(`${key} ${id + 1} 종료됨`);
        setTimeout(() => updateControllerStatus(id), 5000);
      } else if (key === '커넥트') {
        await shutDownConnect(id + 1);
        addLogMessage(`${key} ${id + 1} 종료됨`);
        setTimeout(() => updateConnectStatus(id), 5000);
      }
    } catch (error) {
      addErrorMessage(`${key} ${id + 1} 종료 오류: ${error.message}`);
    } finally {
      setLoading(key, id, false);
      setGlobalLoading(false);
    }
  };

  const handleStart = async (key, id) => {
    setGlobalLoading(true);
    try {
      setLoading(key, id, true);
      const current = new Map(statusMap);
      const updated = [...current.get(key)];
      updated[id] = true;
      current.set(key, updated);
      setStatusMap(current);

      if (key === '브로커') {
        await startBroker(id + 1);
        await updateBrokerStatus(id);
        addLogMessage(`${key} ${id + 1} 시작됨`);
      } else if (key === '컨트롤러') {
        await startController(id + 1);
        await updateControllerStatus(id);
        addLogMessage(`${key} ${id + 1} 시작됨`);
      } else if (key === '커넥트') {
        await startConnect(id + 1);
        await updateConnectStatus(id);
        addLogMessage(`${key} ${id + 1} 시작됨`);
      }
    } catch (error) {
      addErrorMessage(`${key} ${id + 1} 시작 오류: ${error.message}`);
    } finally {
      setLoading(key, id, false);
      setGlobalLoading(false);
    }
  };

  const calcPercentage = (list) => {
    const active = list.filter(Boolean).length;
    return Math.round((active / list.length) * 100);
  };

  const getColorClass = (percentage) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 67) return 'bg-yellow-500';
    if (percentage >= 34) return 'bg-orange-500';
    return 'bg-red-500';
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [broker1, broker2, broker3] = await Promise.all([statusBroker(1), statusBroker(2), statusBroker(3)]);
        const brokerStatus = [broker1, broker2, broker3].map((s) => s.includes('9092'));

        const [ctl1, ctl2, ctl3] = await Promise.all([statusController(1), statusController(2), statusController(3)]);
        const ctlStatus = [ctl1, ctl2, ctl3].map((s) => s.includes('9093'));

        const [conn1, conn2] = await Promise.all([statusConnect(1), statusConnect(2)]);
        const connStatus = [conn1, conn2].map((s) => s.includes('8083'));

        const current = new Map(statusMap);
        current.set('브로커', brokerStatus);
        current.set('컨트롤러', ctlStatus);
        current.set('커넥트', connStatus);
        setStatusMap(current);

        brokerStatus.forEach((_, i) => addLogMessage(`브로커 ${i + 1} 상태: ${brokerStatus[i] ? '정상' : '비정상'}`));
        ctlStatus.forEach((_, i) => addLogMessage(`컨트롤러 ${i + 1} 상태: ${ctlStatus[i] ? '정상' : '비정상'}`));
        connStatus.forEach((_, i) => addLogMessage(`커넥트 ${i + 1} 상태: ${connStatus[i] ? '정상' : '비정상'}`));
      } catch (error) {
        addErrorMessage(`[ERROR] 상태 확인 중 오류 발생: ${error.message}`);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [statusMap]);

  return (
    <div className="bg-gray-900 min-h-screen p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from(statusMap.entries()).map(([key, statusList]) => (
          <StatusBox
            key={key}
            keyName={key}
            statuses={statusList}
            isLoading={(keyName, id) => loadingMap.get(keyName)[id]}
            handleShutdown={handleShutdown}
            handleStart={handleStart}
            globalLoading={globalLoading}
            calcPercentage={calcPercentage}
            getColorClass={getColorClass}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LogBox messages={logMessages} />
        <ErrorBox messages={errorMessages} />
      </div>
      {globalLoading && (
        <div className="text-center text-blue-400 font-semibold animate-pulse">
          전체 작업 처리 중...
        </div>
      )}
    </div>
  );
};

export default KafkaStatus;
