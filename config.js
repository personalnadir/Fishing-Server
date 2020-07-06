const convict = require('convict')
const convict_format_with_validator = require('convict-format-with-validator')
const json5 = require('json5')

convict.addFormats(convict_format_with_validator)
convict.addParser({extension: 'json', parse: json5.parse})

var conf = convict({
    env: {
        doc: "The applicaton environment.",
        format: ["production", "test"],
        default: "test",
        env: "NODE_ENV",
        arg: "env"
    },
    port: {
        doc: "The port to bind.",
        format: "port",
        default: 8080,
        env: "PORT"
    },
    database: {
        uri: {
            doc: "Database URI with user and password",
            format: String,
            default:"mongodb://localhost"
        }
    },
    auth: {
        password: {
            doc: "The password to view data",
            format:String,
            default:"password"
        },
        user: {
            doc: "The username to view data",
            format:String,
            default:"admin"
        }
    }
});

// load environment dependent configuration

var env = conf.get("env");
conf.loadFile("config/" + env + ".json");

// perform validation

conf.validate();

module.exports = conf;