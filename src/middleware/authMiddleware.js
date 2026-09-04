// ==============================================================================
// RetailLaunchOS - Middleware: Autenticação e Controlo de Acessos (RBAC)
// Utiliza exclusivamente node:crypto nativo (Zero Dependências Externas)
// ==============================================================================

const crypto = require('node:crypto');
const Role = require('../models/Role');

const JWT_SECRET = process.env.JWT_SECRET || 'fnac-darty-retaillaunch-multimedia-secret-key-2026';
const TOKEN_EXPIRY_HOURS = 24;

// Base64URL Helpers nativos
function base64UrlEncode(str) {
  return Buffer.from(str).toString('base64url');
}

function base64UrlDecode(str) {
  return Buffer.from(str, 'base64url').toString('utf8');
}

class AuthMiddleware {
  /**
   * Assina um token JWT com algoritmo HMAC-SHA256
   */
  static signToken(user) {
    const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const now = Math.floor(Date.now() / 1000);
    const payload = base64UrlEncode(JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      iat: now,
      exp: now + (TOKEN_EXPIRY_HOURS * 3600)
    }));

    const signature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');

    return `${header}.${payload}.${signature}`;
  }

  /**
   * Valida e decifra um token JWT nativo
   */
  static verifyToken(token) {
    if (!token || typeof token !== 'string') return null;

    const parts = token.trim().split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;

    // Calcular assinatura esperada
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (signature !== expectedSig) {
      return null;
    }

    try {
      const decodedPayload = JSON.parse(base64UrlDecode(payload));
      const now = Math.floor(Date.now() / 1000);

      // Verificar validade temporal (expiração)
      if (decodedPayload.exp && decodedPayload.exp < now) {
        return null;
      }

      return decodedPayload;
    } catch {
      return null;
    }
  }

  /**
   * Extrai o utilizador do cabeçalho Authorization: Bearer <token>
   */
  static extractUserFromRequest(req) {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    if (!authHeader) return null;

    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match) return null;

    return AuthMiddleware.verifyToken(match[1]);
  }

  /**
   * Middleware de autenticação obrigatória
   */
  static authenticate(req, res, next) {
    const user = AuthMiddleware.extractUserFromRequest(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticação necessária. Por favor forneça um token de acesso válido.'
      });
    }

    req.user = user;
    if (next) next();
    return true;
  }

  /**
   * Middleware de verificação de permissões por papel (RBAC)
   */
  static requireRole(...allowedRoles) {
    return (req, res, next) => {
      // Se não autenticado
      if (!req.user) {
        const user = AuthMiddleware.extractUserFromRequest(req);
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Acesso recusado: Utilizador não autenticado no RetailLaunchOS.'
          });
        }
        req.user = user;
      }

      // Se o papel do utilizador não estiver na lista autorizada
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Acesso recusado: O seu perfil (${req.user.role}) não tem permissões suficientes para esta ação. Requer: [${allowedRoles.join(', ')}].`
        });
      }

      if (next) next();
      return true;
    };
  }

  /**
   * Middleware de verificação por ação granular
   */
  static requirePermission(action) {
    return (req, res, next) => {
      if (!req.user) {
        const user = AuthMiddleware.extractUserFromRequest(req);
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Acesso recusado: Sessão não iniciada.'
          });
        }
        req.user = user;
      }

      const permissions = Role.getPermissions(req.user.role);
      if (!permissions[action]) {
        return res.status(403).json({
          success: false,
          message: `Acesso recusado: Ação '${action}' não autorizada para o perfil ${req.user.role}.`
        });
      }

      if (next) next();
      return true;
    };
  }
}

module.exports = AuthMiddleware;
