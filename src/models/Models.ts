import { Sequelize, DataTypes } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const Schema = new Sequelize(
  process.env.DB_NAME || "",
  process.env.DB_USER || "",
  `${process.env.DB_PASSWORD}#` || "",
  {
    host: process.env.DB_HOST || "",
    port: 1433,
    dialect: "mssql",
    logging: false
  }
);

const OfflineTransactionLimit = Schema.define(
  "OfflineTransactionLimit",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    max_amount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    max_age_hrs: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },{
    paranoid: true,
    tableName: "terminal_offline_transaction_limits",
  }
);

const Terminal = Schema.define(
  "Terminal",
  {
    activation_code: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    os_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    os_build: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    os_version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    version_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    terminal_label: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    site_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trading_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_activated: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    is_blocked: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    activated_at:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    offline_trans_max_id: {
      type: DataTypes.INTEGER,
      references: {
        model: OfflineTransactionLimit,
        key: "id",
      },
    },
  },{
    paranoid: true,
    tableName: "terminal_details",
  }
);

const TerminalGlobalConfigDetail = Schema.define(
  "TerminalGlobalConfigDetail",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    version_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    terminal_activation_code: {
      type: DataTypes.STRING,
      references: {
        model: Terminal,
        key: "activation_code",
      },
    },
  },{
    paranoid: true,
    tableName: "terminal_global_configuration_details",
  }
);

const TaxRate = Schema.define(
  "TaxRate",
  {
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    charge_mode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ordinal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    terminal_activation_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    terminal_global_config_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  },{
    paranoid: true,
    tableName: "terminal_tax_rates"
  }
);



const TerminalCredential = Schema.define(
  "TerminalCredential",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    access_token: {
      type: DataTypes.STRING(2500),
      allowNull: true,
    },
    secret_key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    terminal_activation_code: {
      type: DataTypes.STRING,
      references: {
        model: Terminal,
        key: "activation_code",
      },
    },
  },{
    paranoid: true,
    tableName: "terminal_credential_details",
  }
);



const ClientTaxPayerDetail = Schema.define(
  "ClientTaxPayerDetail",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_vat_registered:{
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    tax_office_code:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    version_no:{
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    terminal_activation_code: {
      type: DataTypes.STRING,
      references: {
        model: Terminal,
        key: "activation_code",
      },
    },
  },{
    paranoid: true,
    tableName: "client_tax_payer_details"
  }
);

const ActivatedTaxRate = Schema.define(
  "ActivatedTaxRate",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    tax_rate_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_tax_activated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    client_tax_payer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: ClientTaxPayerDetail,
        key: "id",
      },
    },
    terminal_activation_code: {
      type: DataTypes.STRING,
      references: {
        model: Terminal,
        key: "activation_code",
      },
    },

  },{
    paranoid: true,
    tableName: "activated_tax_rates",
  }
);

const Vat5Certificate = Schema.define(
  "Vat5Certificate",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    project_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    certificate_number: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },{
    paranoid: true,
    tableName: "vat_5_certificate_details",
  }
);

const SaleTaxInvoiceHeader = Schema.define(
  "SaleTaxInvoiceHeader",
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    invoice_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_vat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    offline_signature: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    invoice_total: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    buyer_authorization_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    buyer_tin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    buyer_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seller_tin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoice_date_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_relief_supply: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tax_payer_detail_id: {
      type: DataTypes.INTEGER,
      allowNull:true
    },
    terminal_activation_code: {
      type: DataTypes.STRING,
      allowNull:true
    },
    terminal_global_config_id: {
      type: DataTypes.INTEGER,
      allowNull:true
    },
    vat_5_certificate_id: {
      type: DataTypes.INTEGER,
      allowNull:true
    },
  },{
    paranoid: true,
    tableName: "sale_tax_invoice_head_details",
  }
);


OfflineTransactionLimit.hasOne(Terminal, { foreignKey: 'offline_trans_max_id', onDelete:'CASCADE', onUpdate: 'SET NULL' })
Terminal.belongsTo(OfflineTransactionLimit, { foreignKey: "offline_trans_max_id", onDelete:'CASCADE', onUpdate: 'SET NULL' })


Terminal.hasMany(ClientTaxPayerDetail, { foreignKey: "terminal_activation_code", onDelete:'CASCADE', onUpdate: 'CASCADE' })
ClientTaxPayerDetail.belongsTo(Terminal, { foreignKey: "terminal_activation_code", onDelete:'CASCADE', onUpdate: 'CASCADE' })

//ActivatedTaxRate.hasMany(ClientTaxPayerDetail, { foreignKey: " client_tax_payer_id", onDelete:'CASCADE', onUpdate: 'CASCADE' })
//ActivatedTaxRate.belongsTo(ClientTaxPayerDetail, { foreignKey: " client_tax_payer_id", onDelete:'CASCADE', onUpdate: 'CASCADE' })

Terminal.hasMany(TerminalCredential, { foreignKey: "terminal_activation_code", onDelete:'CASCADE', onUpdate: 'CASCADE' })
TerminalCredential.belongsTo(Terminal, { foreignKey: "terminal_activation_code", onDelete:'CASCADE', onUpdate: 'CASCADE' })

// Terminal.hasMany(SaleTaxInvoiceHeader, { foreignKey: "terminal_activation_code", onDelete:'CASCADE', onUpdate: 'CASCADE' })
// SaleTaxInvoiceHeader.belongsTo(Terminal, { foreignKey: "terminal_activation_code", onDelete:'CASCADE', onUpdate: 'CASCADE' })

// TerminalGlobalConfigDetail.hasMany(SaleTaxInvoiceHeader, { foreignKey: "terminal_global_config_id", onDelete:'CASCADE', onUpdate: 'CASCADE'  })
// SaleTaxInvoiceHeader.belongsTo(TerminalGlobalConfigDetail, { foreignKey: "terminal_global_config_id", onDelete:'CASCADE', onUpdate: 'CASCADE'  })

// Vat5Certificate.hasMany(SaleTaxInvoiceHeader, { foreignKey: "vat_5_certificate_id", onDelete:'CASCADE', onUpdate: 'CASCADE'  })
// SaleTaxInvoiceHeader.belongsTo(Vat5Certificate, { foreignKey: "vat_5_certificate_id", onDelete:'CASCADE', onUpdate: 'CASCADE'  })

// SaleTaxInvoiceHeader.hasMany(SaleTaxInvoice, { foreignKey: "sale_tax_invoice_header_id", onDelete:'CASCADE', onUpdate: 'CASCADE' });
// SaleTaxInvoice.belongsTo(SaleTaxInvoiceHeader, { foreignKey: "sale_tax_invoice_header_id", onDelete:'CASCADE', onUpdate: 'CASCADE' })

// Terminal.hasMany(ActivatedTaxRate, { foreignKey: "terminal_activation_code", onDelete:'SET NULL', onUpdate: 'SET NULL' })
// ActivatedTaxRate.belongsTo(Terminal, { foreignKey: "terminal_activation_code", onDelete:'SET NULL', onUpdate: 'SET NULL' })

// Terminal.hasMany(SaleTaxInvoice, { foreignKey: "terminal_activation_code", onDelete:'SET NULL', onUpdate: 'CASCADE' })
// SaleTaxInvoice.belongsTo(Terminal, { foreignKey: "terminal_activation_code", onDelete:'SET NULL', onUpdate: 'CASCADE' })

// TerminalGlobalConfigDetail.hasMany(TaxRate, { foreignKey: "terminal_global_config_id", onDelete:'CASCADE', onUpdate: 'CASCADE' })
// TaxRate.belongsTo(TerminalGlobalConfigDetail, { foreignKey: "terminal_global_config_id", onDelete:'CASCADE', onUpdate: 'CASCADE' })

export { Schema, Terminal, ActivatedTaxRate, TerminalGlobalConfigDetail, TerminalCredential, TaxRate, SaleTaxInvoiceHeader, ClientTaxPayerDetail, Vat5Certificate, OfflineTransactionLimit };