# 커리큘럼

- 기간: 9월 9일(수)~12월 2일(수), 총 9회
- 일시: 매주 수요일 18:20~19:00
- 장소: 전자정보대학 강의실
- 휴회: 9월 30일(수) — 가을 축제 / 10월 14일(수)·21일(수)·28일(수) — 중간고사

## 1주차 · 9월 9일(수) — [주변 친구](./w01-주변-친구/)

계속 바뀌는 사용자 위치를 실시간으로 처리하고 주변 친구에게 전달하는 시스템을 설계합니다. 많은 연결과 잦은 상태 변경을 감당하기 위한 실시간 통신 방식, 위치 데이터 관리, 서버 확장 전략을 익힙니다.

**Keywords:** `WebSocket` · `Redis Pub/Sub` · `Geohash` · `Fan-out` · `Consistent Hashing` · `Service Discovery`

## 2주차 · 9월 16일(수) — [분산 메시지 큐](./w02-분산-메시지-큐/)

서비스 사이에서 대량의 메시지를 안정적으로 전달하는 시스템을 설계합니다. 생산자와 소비자의 결합을 낮추면서 처리량을 늘리고, 메시지의 저장·전달·재처리 과정에서 발생하는 장애에 대응하는 원리를 이해합니다.

**Keywords:** `Producer/Consumer` · `Topic & Partition` · `Broker` · `Consumer Group` · `Replication` · `Delivery Semantics` · `Retention`

## 3주차 · 9월 23일(수) — [지표 모니터링 및 경보](./w03-지표-모니터링-및-경보/)

대규모 서비스의 상태를 지속적으로 관찰하고 이상 징후를 알리는 시스템을 설계합니다. 지표 수집부터 시계열 데이터 저장, 조회, 경보까지 이어지는 흐름을 살펴보며 관측 시스템이 큰 데이터 규모를 다루는 방식을 배웁니다.

**Keywords:** `Time-Series Database (TSDB)` · `Pull/Push Model` · `Aggregation` · `Downsampling` · `Tags & Labels` · `Alert Rules` · `Alert Deduplication`

## 4주차 · 10월 7일(수) — [광고 클릭 이벤트 집계](./w04-광고-클릭-이벤트-집계/)

끊임없이 들어오는 클릭 이벤트를 실시간으로 집계하는 시스템을 설계합니다. 이벤트가 늦게 도착하거나 중복되고 처리 도중 장애가 발생해도 신뢰할 수 있는 결과를 만들기 위한 스트림 처리와 정확성 보장 방법을 익힙니다.

**Keywords:** `Kafka` · `Stream Processing` · `Event Time` · `Watermark` · `Windowed Aggregation` · `Deduplication` · `Reprocessing`

## 5주차 · 11월 4일(수) — [호텔 예약 시스템](./w05-호텔-예약-시스템/)

한정된 객실에 예약 요청이 동시에 몰리는 시스템을 설계합니다. 중복 예약이 발생하는 경쟁 조건을 이해하고, 트랜잭션과 잠금 같은 동시성 제어 방법을 비교하며 데이터 일관성을 지키는 법을 배웁니다.

**Keywords:** `Idempotency Key` · `Database Transaction` · `Optimistic Locking` · `Pessimistic Locking` · `Race Condition` · `Inventory Management` · `Database Sharding`

## 6주차 · 11월 11일(수) — [객체 저장소](./w06-객체-저장소/)

이미지와 동영상 같은 막대한 비정형 데이터를 저장하는 시스템을 설계합니다. 데이터와 메타데이터를 분리하고 여러 장치에 복제하는 구조를 통해 낮은 비용, 높은 내구성, 수평 확장을 함께 달성하는 원리를 이해합니다.

**Keywords:** `Object/Block/File Storage` · `Metadata` · `Consistent Hashing` · `Replication` · `Erasure Coding` · `Checksum` · `Garbage Collection`

## 7주차 · 11월 18일(수) — [결제 시스템](./w07-결제-시스템/)

외부 결제 시스템과 여러 장애가 개입해도 돈의 이동을 정확히 처리하는 시스템을 설계합니다. 재시도로 인한 중복 결제를 막고 처리 결과를 사후에 대사할 수 있도록 멱등성, 상태 관리, 검증 절차를 설계하는 법을 익힙니다.

**Keywords:** `Payment Service Provider (PSP)` · `Idempotency` · `Retry` · `Webhook` · `Ledger` · `Double-Entry Bookkeeping` · `Reconciliation`

## 8주차 · 11월 25일(수) — [전자 지갑](./w08-전자-지갑/)

분산된 여러 상태를 하나의 거래처럼 안전하게 변경하는 시스템을 설계합니다. 분산 트랜잭션의 어려움과 해결 방식을 비교하고, 장애 이후에도 거래 과정을 추적하고 재현할 수 있는 기록 구조를 배웁니다.

**Keywords:** `Distributed Transaction` · `Two-Phase Commit (2PC)` · `Try-Confirm/Cancel (TC/C)` · `Saga` · `Event Sourcing` · `CQRS` · `Deterministic State Machine`

## 9주차 · 12월 2일(수) — [증권 거래소](./w09-증권-거래소/)

정확성과 초저지연이 동시에 필요한 주문 처리 시스템을 설계합니다. 모든 주문에 일관된 처리 순서를 부여하고 같은 입력에서 같은 결과를 만드는 결정성을 확보하며, 핵심 처리 경로의 성능을 지키는 방법을 익힙니다.

**Keywords:** `Order Book` · `Matching Engine` · `Sequencer` · `Price-Time Priority` · `Event Sourcing` · `Determinism` · `Ultra-Low Latency`

> 근접성 서비스, 구글 맵, 분산 이메일, 실시간 게임 순위표 챕터는 본 세션에서 다루지 않습니다.

[메인으로 돌아가기](./README.md)
