# Deployment Configuration
## Wildfly database security
    <security-domain name="PytclonDB" cache-type="default">
        <authentication>
            <login-module code="Database" flag="required">
                <module-option name="dsJndiName" value="java:jboss/datasources/wflydevelopment"/>
                <module-option name="principalsQuery" value="select passwd from USERS where login=?"/>
                <module-option name="rolesQuery" value="select role, 'Roles' from USER_ROLES where login=?"/>
                <module-option name="hashAlgorithm" value="SHA-256"/>
                <module-option name="hashEncoding" value="BASE64"/>
            </login-module>
        </authentication>
    </security-domain>
    
## SSL configuration
### In security-realms
    <security-realm name="SSLRealm">
        <server-identities>
            <ssl>
                <keystore path="pytclon.jks" relative-to="jboss.server.config.dir" keystore-password="catalina" alias="pytclon_test_cert" key-password="qazqaz"/>
            </ssl>
        </server-identities>
    </security-realm>
### In urn:jboss:domain:undertow
    <https-listener name="https" socket-binding="https" security-realm="SSLRealm"/>