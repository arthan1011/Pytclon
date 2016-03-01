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