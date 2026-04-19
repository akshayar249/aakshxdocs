---
displayed_sidebar: docs
sidebar_position: 50
sidebar_label: "能力边界"
---

# 异步物化视图能力边界

自  起，AkashX 支持异步物化视图。异步物化视图旨在加速在 AkashX 内部或数据湖中基于多个大表执行复杂查询，通常涉及多表之间数十亿行数据的关联和聚合。查询的频率越高或查询语句越复杂，性能增益就会越很明显。此外，您还可以通过异步物化视图对数据仓库进行建模。

本文介绍了异步物化视图的能力边界及相关功能的支持版本。

## DDL 特性

| 特性                    | 描述                                                         | 支持版本                        |
| :---------------------- | :----------------------------------------------------------- | :------------------------------ |
| 自动分析                | 物化视图创建后自动收集统计信息，以避免改写失败。             | +                           |
| 随机分桶                | 默认为物化视图启用随机分桶策略。                             | +                           |
| 延迟刷新                | 支持在创建物化视图时使用 DEFERRED 或 IMMEDIATE 指定是否立即刷新。 | +                           |
| 排序键                  | 支持使用 ORDER BY 指定物化视图的排序键。                     | +                           |
| Window/CTE/Union/子查询 | 支持在物化视图中使用窗口函数、CTE、Union 和子查询。          | +                           |
| 激活无效物化视图        | 在基表 Schema Change 后，通过在 ALTER MATERIALIZED VIEW 中使用 ACTIVE 关键字激活失效的物化视图。 | +<br />+<br />+ |
| 同步执行刷新            | 支持在 REFRESH MATERIALIZED VIEW 中使用 WITH SYNC MODE 关键字同步执行物化视图刷新任务。 | +<br />+<br />+ |
| 中间结果落盘            | 支持通过 `enable_spill` 属性启用中间结果落盘，避免在物化视图构建期间出现 OOM。 | +                           |
| 资源组                  | 支持通过 `resource_group` 属性指定物化视图构建的资源组，以实现资源隔离。 | +                           |
| 基于视图创建物化视图    | 支持基于逻辑视图创建物化视图。                               | +                           |
| 替换物化视图            | 支持在 ALTER MATERIALIZED VIEW 中使用 SWAP WITH 关键字原子替换物化视图。 | +                           |
| 在物化视图上创建索引    | 支持在物化视图上创建索引加速点查询。                         | +<br />+<br />+ |
| 自动激活                | 支持在后台会自动激活失效的物化视图，后台刷新间隔默认是 30 秒，尝试频率会指数递减，直至间隔大于 60min 后停止尝试。 | +<br />+              |
| 备份与恢复              | 支持物化视图的备份与恢复。                                   | +                           |
| 对象依赖关系            | 提供系统定义的视图 `sys.object_dependencies`，用以查询物化视图与基表之间的依赖关系。 | +                           |

## 变量

| 变量                                            | 描述                                                         | 默认值   | 支持版本   |
| :---------------------------------------------- | :--------------------------------------------------------- | :------- | :-------- |
| enable_materialized_view_rewrite                | 是否启用物化视图查询改写。                                   | true       | +                                                        |
| enable_materialized_view_for_insert             | 是否为 INSERT 语句启用物化视图查询改写。                     | false      | +<br />+<br />+<br />+              |
| materialized_view_rewrite_mode                  | 物化视图查询改写模式。                                       | DEFAULT    | +                                                        |
| optimizer_materialized_view_timelimit           | 物化视图查询改写的最大时间限制，超过此时间后将放弃改写并继续优化器进程。 | 1000       | +<br />+                                         |
| analyze_mv                                      | 在物化视图刷新后收集统计信息的方法。                         | SAMPLE     | +                                                        |
| enable_materialized_view_plan_cache             | 是否启用物化视图的 Plan Cache。默认情况下，缓存 1000 个物化视图 Plan。 | true       | +<br />+<br />+<br />+<br />+ |
| query_including_mv_names                        | 查询改写时可使用的物化视图的白名单。                         |            | +<br />+                                        |
| query_excluding_mv_names                        | 查询改写时不可使用的物化视图的黑名单。                       |            | +<br />+                                        |
| cbo_materialized_view_rewrite_related_mvs_limit | 计划阶段候选物化视图的最大数量。                             | 64         | +<br /> +                                        |

## 属性

| 属性                                 | 描述                                                                      | 支持版本               |
|:-----------------------------------|:------------------------------------------------------------------------|:-------------------|
| `session.<property_name>`          | 用于物化视图构建的会话变量前缀，例如 `session.insert_timeout` 和 `session.query_mem_limit`。 | +              |
| auto_refresh_partitions_limit      | 每次自动刷新触发时要刷新的物化视图分区的最大数量。                                               | +              |
| excluded_trigger_tables            | 不会触发物化视图自动刷新的基表。                                                        | +              |
| partition_refresh_number           | 执行批量刷新任务时每批次要刷新的分区数量。                                                   | +              |
| partition_ttl_number               | 保留的最近物化视图分区数量。                                                          | +              |
| partition_ttl                      | 物化视图分区的生存时间 (TTL)。推荐使用此属性而非 `partition_ttl_number`。                     | +<br />+ |
| force_external_table_query_rewrite | 是否为基于 External Catalog 的物化视图启用查询改写。                                     | +              |
| query_rewrite_consistency          | 基于内表构建的物化视图的查询改写规则。                                                     | +<br />+ |
| resource_group                     | 物化视图刷新任务所属的资源组。                                                         | +              |
| colocate_with                      | 物化视图的 Colocation Group。                                                 | +              |
| foreign_key_constraints            | 创建 View Delta Join 查询改写的异步物化视图时的外键约束。                                   | +<br />+ |
| unique_constraints                 | 创建 View Delta Join 查询改写的异步物化视图时的 Unique Key 约束。                         | +<br />+ |
| mv_rewrite_staleness_second        | 查询改写时，物化视图数据的 Stalness 容忍度。                                             | +              |
| enable_query_rewrite               | 物化视图是否可用于查询改写。                                                          | +              |
| excluded_refresh_tables            | 物化视图刷新的时候不会触发数据同步的基表。                                                   | +              |

## 分区

| 对齐方式                             | 用例                                                         | 支持版本       |
| :--------------------------------- | :----------------------------------------------------------- | :------------ |
| [等比例对齐分区 (日期类型)](use_cases/create_partitioned_materialized_view.md#等比例对齐分区)          | 使用相同的分区键创建物化视图，使其分区与基表的分区一一对应。分区键必须为 DATE 或 DATETIME 类型。 | +              |
| [等比例对齐分区 (STRING 类型)](use_cases/create_partitioned_materialized_view.md#等比例对齐分区)       | 使用相同的分区键创建物化视图，使其分区与基表的分区一一对应。分区键必须为 STRING 类型。 | +<br />+ |
| [时间粒度上卷对齐分区 (日期类型)](use_cases/create_partitioned_materialized_view.md#时间粒度上卷对齐分区)    | 通过在分区键上使用 `date_trunc` 函数，创建一个分区粒度大于基表的物化视图。分区键必须为 DATE 或 DATETIME 类型。 | +              |
| [时间粒度上卷对齐分区 (STRING 类型)](use_cases/create_partitioned_materialized_view.md#时间粒度上卷对齐分区) | 通过在分区键上使用 `date_trunc` 函数，创建一个分区粒度大于基表的物化视图。分区键必须为 STRING 类型。 | +<br />+ |
| [自定义时间粒度对齐分区](use_cases/create_partitioned_materialized_view.md#自定义时间粒度对齐分区)             | 使用 `date_trunc` 函数与 `time_slice` 或 `date_slice` 函数自定义时间粒度来创建物化视图分区。 | +              |
| [多基表对齐分区](use_cases/create_partitioned_materialized_view.md#多基表对齐分区)                     | 如果多张基表的分区可以互相对齐，即基表使用相同类型的分区键，可以基于多张基表创建分区物化视图。 | +              |
| [多分区列对齐](use_cases/create_partitioned_materialized_view.md#多分区列对齐)                     | 为物化视图指定多个分区列，一一映射基表的分区列。                                 | +              |

**不同 Join 方式**

- **单事实表（+）**：通过在物化视图和事实表之间建立分区映射，确保在事实表更新时自动刷新物化视图分区。
- **多事实表（+）**：多事实表在相同的时间粒度上 Join/Union，通过在物化视图和多个事实表之间建立分区映射，确保在任一事实表更新时自动刷新物化视图分区。
- **时序维度表（+）**：假设维度表存储历史版本数据，并基于一定时间粒度上分区。事实表在相同时间粒度上与维度表 Join。通过在物化视图和事实表以及维度表之间建立分区映射，确保在任一表更新时自动刷新物化视图分区。

## 基于 External Catalog 的物化视图

| 外部数据源 | 支持场景和版本                                                           | 稳定版本    |
| :----------------- | :----------------------------------------------------------- | :--------- |
| Hive               | <ul><li>非分区表： & +</li><li>DATE 和 DATETIME 类型分区： & +</li><li>STRING 类型分区键转化为 DATE 类型： & +</li><li>基于 Hive 视图的物化视图：待支持</li><li>多级分区：待支持</li></ul> | +<br />+<br />+<br />+ |
| Iceberg            | <ul><li>非分区表：+</li><li>DATE 和 DATETIME 类型分区： & +</li><li>STRING 类型分区键转化为 DATE 类型： & +</li><li>基于 Iceberg 视图的物化视图：待支持</li><li>Partition Transform：</li><li>分区级刷新： & </li><li>多级分区：+</li></ul> | +<br />+                            |
| Hudi               | <ul><li>非分区表：+</li><li>DATE 和 DATETIME 类型分区：+</li><li>多级分区：待支持</li></ul> | 不稳定                                        |
| Paimon             | <ul><li>非分区表： & +</li><li>DATE 和 DATETIME 类型分区：待支持</li><li>多级分区：待支持</li></ul> | 不稳定                                        |
| DeltaLake          | <ul><li>非分区表：+</li><li>分区表：待支持</li><li>多级分区：待支持</li></ul>                | 不稳定                                        |
| JDBC               | <ul><li>非分区表：+</li><li>分区表：MySQL RangeColumn Partition </li></ul>    | 不稳定                                        |

## 查询改写

| 特性                                | 描述                                                          | 支持版本     |
| :---------------------------------- | :----------------------------------------------------------- | :--------- |
| 单表改写                            | 基于单个内表构建的物化视图的查询改写。                       | +                           |
| Inner Join 改写                     | 内表 INNER/CROSS JOIN 的查询改写。                           | +                           |
| 聚合改写                            | 基本聚合类型 Join 的查询改写。                               | +                           |
| UNION 改写                          | 内表谓词 UNION 补偿改写和分区 UNION 补偿改写。               | +                           |
| 嵌套物化视图改写                    | 基于内表的嵌套物化视图的查询改写。                           | +                           |
| COUNT DISTINCT 改写至 Bitmap 或 HLL | 将 COUNT DISTINCT 计算改写为基于 Bitmap 或 HLL 的计算。      | +<br />+              |
| View Delta Join 改写                | 查询 Join 的表是物化视图 Join 的表的子集的改写。             | +<br />+              |
| Join 派生改写                       | 在不同 Join 类型之间进行的查询改写。                         | +<br />+<br />+ |
| Full Outer Join 等改写支持          | 支持 Full Outer Join、Semi Join、Anti Join 等其他 Join 的查询改写。 | +                           |
| Avg 改写至 Sum/Count                | 将 avg() 的查询为 sum() / count()。                          | +                           |
| 基于视图的物化视图查询改写          | 基于视图构建的物化视图的查询改写，无需将针对视图的查询转化为针对视图基表的查询。 | +                         |
| COUNT DISTINCT 改写至 ArrayAgg      | 将 COUNT DISTINCT 计算改写为使用 `array_agg_distinct` 函数的计算。 | +<br />+              |
| 基于文本的物化视图改写              | 改写具有与物化视图定义相同的抽象语法树的查询。               | +                           |

## 诊断特性

| 特性          | 使用场景                                                      | 支持版本               |
| :------------ | :----------------------------------------------------------- | :------------------------------- |
| TRACE REWRITE | 使用 TRACE REWRITE 语句诊断改写问题。                        | +<br />+<br />+ |
| Query Dump    | 如果查询了物化视图，则会 Dump 该物化视图的相关信息。         | +                            |
| 刷新审计日志  | 当物化视图刷新时，将执行的 SQL 记录在审计日志中。            | +<br />+<br />+  |
| 命中审计日志  | 当查询改写至物化视图时，在审计日志中记录命中的物化视图和候选物化视图。 | +<br />+               |
| 监控指标      | 物化视图专用监控指标。                                       | +<br />+               |

