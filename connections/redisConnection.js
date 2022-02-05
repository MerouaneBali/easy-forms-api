const Redis = require("ioredis");
const env = require("../configs/env");
const {
  redisConnectionOpenHandler,
  redisDisconnectHandler,
  redisConnectionErrorHandler,
} = require("../utils/handlers");

redisAuthSessionClient = new Redis({
  host: process.env.REDIS_AUTH_DB_HOST,
  port: process.env.REDIS_AUTH_DB_PORT,
  password: process.env.REDIS_AUTH_DB_PASSWORD,
  // TODO: Add in the future Username/Password authentication, and TLS when using SSL
});

redisAuthSessionClient.on("connect", () =>
  redisConnectionOpenHandler("Auth Session Cache")
);
redisAuthSessionClient.on("end", () =>
  redisDisconnectHandler("Auth Session Cache")
);
redisAuthSessionClient.on("error", (error) =>
  redisConnectionErrorHandler("Auth Session Cache", error)
);

redisUpdatesClient = new Redis({
  host: process.env.REDIS_UPDATES_DB_HOST,
  port: process.env.REDIS_UPDATES_DB_PORT,
  password: process.env.REDIS_UPDATES_DB_PASSWORD,
  // TODO: Add in the future Username/Password authentication, and TLS when using SSL
});

redisUpdatesClient.on("connect", () =>
  redisConnectionOpenHandler("Updates Cache")
);
redisUpdatesClient.on("end", () => redisDisconnectHandler("Updates Cache"));
redisUpdatesClient.on("error", (error) =>
  redisConnectionErrorHandler("Updates Cache", error)
);

redisEmailVerificationClient = new Redis({
  host: process.env.REDIS_EMAIL_VERIFICATION_DB_HOST,
  port: process.env.REDIS_EMAIL_VERIFICATION_DB_PORT,
  password: process.env.REDIS_EMAIL_VERIFICATION_DB_PASSWORD,
  // TODO: Add in the future Username/Password authentication, and TLS when using SSL
});

redisEmailVerificationClient.on("connect", () =>
  redisConnectionOpenHandler("Email Verification Cache")
);
redisEmailVerificationClient.on("end", () =>
  redisDisconnectHandler("Email Verification Cache")
);
redisEmailVerificationClient.on("error", (error) =>
  redisConnectionErrorHandler("Email Verification Cache", error)
);

redisPasswordResetsClient = new Redis({
  host: process.env.REDIS_RESETS_DB_HOST,
  port: process.env.REDIS_RESETS_DB_PORT,
  password: process.env.REDIS_RESETS_DB_PASSWORD,
  // TODO: Add in the future Username/Password authentication, and TLS when using SSL
});

redisPasswordResetsClient.on("connect", () =>
  redisConnectionOpenHandler("Resets Cache")
);
redisPasswordResetsClient.on("end", () =>
  redisDisconnectHandler("Resets Cache")
);
redisPasswordResetsClient.on("error", (error) =>
  redisConnectionErrorHandler("Resets Cache", error)
);

module.exports = {
  redisAuthSessionClient,
  redisUpdatesClient,
  redisEmailVerificationClient,
  redisPasswordResetsClient,
};
