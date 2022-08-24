const mysql = [
  'BOOLEAN',
  'TINYINT',
  'SMALLINT',
  'INT',
  'BIGINT',
  'FLOAT',
  'DOUBLE',
  'DECIMAL',
  'STRING',
  'VARCHAR',
  'CHAR',
  'TIMESTAMP',
  'DATE',
  'BINARY'
]

const pg = [
  'SMALLINT',
  'SMALLSERIAL',
  'INT2',
  'INT',
  'INTEGER',
  'SERIAL',
  'INT4',
  'BIGINT',
  'BIGSERIAL',
  'OID',
  'INT8',
  'REAL',
  'FLOAT4',
  'FLOAT',
  'DOUBLE PRECISION',
  'FLOAT8',
  'DECIMAL',
  'NUMERIC',
  'CHARACTER VARYING',
  'VARCHAR',
  'CHARACTER',
  'CHAR',
  'TEXT',
  'NAME',
  'BPCHAR',
  'BYTEA',
  'TIMESTAMP',
  'TIMESTAMPTZ',
  'DATE',
  'TIME',
  'TIMETZ',
  ' BOOLEAN',
  'BOOL'
]

const sqlServer = [
  'BIT',
  'INT',
  'SMALLINT',
  'TINYINT',
  'BIGINT',
  'INT IDENTITY',
  'REAL',
  'FLOAT',
  'DECIMAL',
  'NUMERIC',
  'CHAR',
  'VARCHAR',
  'VARCHAR(MAX)',
  'TEXT',
  'XML',
  'NCHAR',
  'NVARCHAR',
  'NVARCHAR(MAX)',
  'NTEXT',
  'TIME',
  'DATE',
  'DATETIME',
  'DATETIME2',
  'SMALLDATETIME',
  'DATETIMEOFFSET',
  'TIMESTAMP',
  'BINARY',
  'VARBINARY',
  'IMAGE',
  'MONEY',
  'SMALLMONEY',
  'UNIQUEIDENTIFIER'
]

export const fieldTypeMapper = new Map([
  ['mysql', mysql],
  [
    'oracle',
    [
      'SMALLINT',
      'BINARY_DOUBLE',
      'CHAR',
      'VARCHAR',
      'VARCHAR2',
      'NCHAR',
      'NVARCHAR2',
      'INT',
      'INTEGER',
      'NUMBER',
      'DECIMAL',
      'FLOAT',
      'DATE',
      'RAW',
      'LONG RAW',
      'BINARY_FLOAT',
      'TIMESTAMP',
      'TIMESTAMP WITH LOCAL TIME ZONE',
      'TIMESTAMP WITH TIME ZON',
      'INTERVAL YEAR',
      'INTERVAL DAY'
    ]
  ],
  ['postgresql', pg],
  ['sqlserver', sqlServer],
  [
    'db2',
    [
      'BOOLEAN',
      'TINYINT',
      'SMALLINT',
      'INT',
      'BIGINT',
      'FLOAT',
      'DOUBLE',
      'DECIMAL',
      'STRING',
      'VARCHAR',
      'CHAR',
      'TIMESTAMP',
      'DATE',
      'BINARY'
    ]
  ],
  [
    'click_house',
    [
      'BOOLEAN',
      'TINYINT',
      'SMALLINT',
      'INT',
      'BIGINT',
      'FLOAT',
      'DOUBLE',
      'DECIMAL',
      'STRING',
      'VARCHAR',
      'CHAR',
      'TIMESTAMP',
      'DATE',
      'BINARY',
      'NULL'
    ]
  ],
  [
    'hive',
    [
      /* BOOLEAN、TINYINT、SMALLINT、INT、BIGINT、FLOAT、DOUBLE、DECIMAL、STRING、VARCHAR、CHAR、TIMESTAMP、DATE、BINARY */
      'BOOLEAN',
      'TINYINT',
      'SMALLINT',
      'INT',
      'BIGINT',
      'FLOAT',
      'DOUBLE',
      'DECIMAL',
      'STRING',
      'VARCHAR',
      'CHAR',
      'TIMESTAMP',
      'DATE',
      'BINARY'
    ]
  ],
  [
    'elastic_search',
    [
      // INTEGER,SMALLINT,DECIMAL,TIMESTAM DOUBLE,FLOAT,DATE,VARCHAR,VARCHAR,TIMESTAMP,TIME,BYTE
      'BOOLEAN',
      'BYTE',
      'SHORT',
      'INTEGER',
      'LONG',
      'FLOAT',
      'DOUBLE',
      'TEXT',
      'BINARY',
      'DATE',
      'OBJECT',
      'NESTED'
    ]
  ],
  ['binlog', mysql],
  ['pg_wal', pg],
  ['sql_server_cdc', sqlServer],
  [
    'hbase',
    [
      // BOOLEAN、TINYINT、SMALLINT、INT、BIGINT、FLOAT、DOUBLE、DECIMAL、STRING、VARCHAR、CHAR、TIMESTAMP、DATE、BINARY
      'BOOLEAN',
      'TINYINT',
      'SMALLINT',
      'INT',
      'BIGINT',
      'FLOAT',
      'DOUBLE',
      'DECIMAL',
      'STRING',
      'VARCHAR',
      'CHAR',
      'TIMESTAMP',
      'DATE',
      'BINARY'
    ]
  ],
  [
    'hdfs',
    // BOOLEAN、TINYINT、SMALLINT、INT、BIGINT、FLOAT、DOUBLE、DECIMAL、STRING、VARCHAR、CHAR、TIMESTAMP、DATE、BINARY
    [
      'BOOLEAN',
      'TINYINT',
      'SMALLINT',
      'INT',
      'BIGINT',
      'FLOAT',
      'DOUBLE',
      'DECIMAL',
      'STRING',
      'VARCHAR',
      'CHAR',
      'TIMESTAMP',
      'DATE',
      'BINARY'
    ]
  ],
  [
    'mongodb',
    [
      // long、double、decimal、objectId、string、bindata、date、timestamp、bool
      'long',
      'double',
      'decimal',
      'objectId',
      'string',
      'bindata',
      'date',
      'timestamp',
      'bool'
    ]
  ]
])

export const fieldTypeMapper2Target = new Map([
  [
    'kafka',
    [
      'SMALLINT',
      'SMALLSERIAL',
      'INT2',
      'INT',
      'INTEGER',
      'SERIAL',
      'INT4',
      'BIGINT',
      'BIGSERIAL',
      'OID',
      'INT8',
      'REAL',
      'FLOAT4',
      'FLOAT',
      'DOUBLE PRECISION',
      'FLOAT8',
      'DECIMAL',
      'NUMERIC',
      'CHARACTER VARYING',
      'VARCHAR',
      'CHARACTER',
      'CHAR',
      'TEXT',
      'NAME',
      'BPCHAR',
      'BYTEA',
      'TIMESTAMP',
      'TIMESTAMPTZ',
      'DATE',
      'TIME',
      'TIMETZ',
      'BOOLEAN',
      'BOOL'
    ]
  ]
])

export const fieldTypeMapper2Source = new Map([
  [
    'kafka',
    [
      // BOOLEAN、TINYINT、SMALLINT、INT、BIGINT、FLOAT、DOUBLE、DECIMAL、STRING、VARCHAR、CHAR、TIMESTAMP、DATE、BINARY、ARRAY、MAP、STRUCT、LIST、ROW
      'BOOLEAN',
      'TINYINT',
      'SMALLINT',
      'INT',
      'BIGINT',
      'FLOAT',
      'DOUBLE',
      'DECIMAL',
      'STRING',
      'VARCHAR',
      'CHAR',
      'TIMESTAMP',
      'DATE',
      'BINARY',
      'ARRAY',
      'MAP',
      'STRUCT',
      'LIST',
      'ROW'
    ]
  ]
])

export const getFieldTypeMapper = (type: string, isSource = true) => {
  const map = isSource ? fieldTypeMapper2Source : fieldTypeMapper2Target
  return map.get(type) ?? fieldTypeMapper.get(type)
}

export default {}
