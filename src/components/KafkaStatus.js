import React, { useEffect, useState } from 'react';
import StatusBox from './StatusBox';
import LogBox from './LogBox';
import ErrorBox from './ErrorBox';
import {
  shutDownBroker,
  shutDownController,
  shutDownConnect,
  shutDownSchema,
  shutDownC3,
  startBroker,
  startController,
  startConnect,
  startSchema,
  startC3,
  statusBroker,
  statusController,
  statusConnect,
  statusSchema,
  statusC3,
} from '../api/api';

const KafkaStatus = () => {
  const [statusMap, setStatusMap] = useState(
    new Map([
      ['브로커', [true, true, true]],
      ['컨트롤러', [true, true, true]],
      ['커넥트', [true, true]],
      ['스키마', [true, true]],
      ['C3', [true]],
    ])
  );

  const [loadingMap, setLoadingMap] = useState(
    new Map([
      ['브로커', [false, false, false]],
      ['컨트롤러', [false, false, false]],
      ['커넥트', [false, false]],
      ['스키마', [false, false]],
      ['C3', [false]],
    ])
  );

  const [logMessages, setLogMessages] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(false);

  const addLogMessage = (message) => {
    setLogMessages((prev) => {
      const updated = [...prev, `[LOG ${new Date().toLocaleTimeString()}] ${message}`];
      return updated.slice(-10);
    });
  };

  const addErrorMessage = (message) => {
    setErrorMessages((prev) => {
      const updated = [...prev, `[ERROR ${new Date().toLocaleTimeString()}] ${message}`];
      return updated.slice(-10);
    });
  };

  const setLoading = (key, id, value) => {
    const updated = [...loadingMap.get(key)];
    updated[id] = value;
    const newMap = new Map(loadingMap);
    newMap.set(key, updated);
    setLoadingMap(newMap);
  };

  const updateStatus = async (key, id) => {
    const apis = {
      '브로커': statusBroker,
      '컨트롤러': statusController,
      '커넥트': statusConnect,
      '스키마': statusSchema,
      'C3': statusC3,
    };

    const ports = {
      '브로커': '9092',
      '컨트롤러': '9093',
      '커넥트': '8083',
      '스키마': '8081',
      'C3': '9021',
    };

    try {
      const res = await apis[key](id + 1);
      const isActive = res.includes(ports[key]);
      const current = new Map(statusMap);
      const updated = [...current.get(key)];
      updated[id] = isActive;
      current.set(key, updated);
      setStatusMap(current);

      if (isActive) {
        addLogMessage(`${key} ${id + 1} 상태: 정상`);
      } else {
        addErrorMessage(`${key} ${id + 1} 비정상 상태`);
      }

      return isActive;
    } catch (error) {
      addErrorMessage(`${key} ${id + 1} 상태 확인 실패: ${error.message}`);
      return null;
    }
  };

  const handleShutdown = async (key, id) => {
    setGlobalLoading(true);
    const shutdownApis = {
      '브로커': shutDownBroker,
      '컨트롤러': shutDownController,
      '커넥트': shutDownConnect,
      '스키마': shutDownSchema,
      'C3': shutDownC3,
    };

    try {
      setLoading(key, id, true);
      await shutdownApis[key](id + 1);
      addLogMessage(`${key} ${id + 1} 종료 요청됨`);

      for (let i = 0; i < 10; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        const result = await updateStatus(key, id);
        if (result === false) break;
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
    const startApis = {
      '브로커': startBroker,
      '컨트롤러': startController,
      '커넥트': startConnect,
      '스키마': startSchema,
      'C3': startC3,
    };

    try {
      setLoading(key, id, true);
      await startApis[key](id + 1);
      addLogMessage(`${key} ${id + 1} 시작 요청됨`);

      for (let i = 0; i < 10; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        const result = await updateStatus(key, id);
        if (result === true) break;
      }
    } catch (error) {
      addErrorMessage(`${key} ${id + 1} 시작 오류: ${error.message}`);
    } finally {
      setLoading(key, id, false);
      setGlobalLoading(false);
    }
  };

  const calcPercentage = (list) => {
    if (!list) return 0;
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
        const allStatus = await Promise.all([
          statusBroker(1), statusBroker(2), statusBroker(3),
          statusController(1), statusController(2), statusController(3),
          statusConnect(1), statusConnect(2),
          statusSchema(1), statusSchema(2),
          statusC3(1),
        ]);

        const map = new Map(statusMap);
        map.set('브로커', allStatus.slice(0, 3).map((s) => s.includes('9092')));
        map.set('컨트롤러', allStatus.slice(3, 6).map((s) => s.includes('9093')));
        map.set('커넥트', allStatus.slice(6, 8).map((s) => s.includes('8083')));
        map.set('스키마', allStatus.slice(8, 10).map((s) => s.includes('8081')));
        map.set('C3', [allStatus[10].includes('9021')]);
        setStatusMap(map);

        ['브로커', '컨트롤러', '커넥트', '스키마', 'C3'].forEach((key) => {
          const slice = map.get(key);
          slice.forEach((ok, i) => {
            if (ok) addLogMessage(`${key} ${i + 1} 상태: 정상`);
            else addErrorMessage(`${key} ${i + 1} 비정상 상태`);
          });
        });
      } catch (error) {
        addErrorMessage(`상태 확인 오류: ${error.message}`);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

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
