import { prisma } from '../config/db.js';

export const auditLog = (action, resource) => {
  return async (req, res, next) => {
    // Intercept the response to log after it completes
    const originalSend = res.send;
    
    res.send = function (data) {
      res.send = originalSend;
      
      const statusCode = res.statusCode;
      const status = statusCode >= 200 && statusCode < 400 ? 'SUCCESS' : 'FAILURE';
      
      // Async log writing, fire and forget
      if (req.user) {
        prisma.auditLog.create({
          data: {
            user_id: req.user.id,
            action,
            resource,
            resource_id: req.params.id || null, // Best effort to capture resource ID
            ip_address: req.ip || req.connection.remoteAddress,
            user_agent: req.get('User-Agent'),
            status,
            details: JSON.stringify({
              method: req.method,
              url: req.originalUrl,
              body: req.method !== 'GET' ? req.body : undefined,
              statusCode
            })
          }
        }).catch(err => console.error('Failed to write audit log', err));
      }

      return res.send(data);
    };

    next();
  };
};
