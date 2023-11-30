"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var z = require("zod");
var prisma_1 = require("../lib/prisma");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
dotenv.config();
var SECRET = process.env.SECRET;
var saltRounds = 14;
router.post('/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var phoneNumberSchema, userSchema, bodyParams, bodyParsed_1, userAlreadyExists, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                phoneNumberSchema = z.object({
                    number: z.coerce.string().length(9),
                    ddd: z.coerce.string().length(2)
                });
                userSchema = z.object({
                    name: z.string(),
                    email: z.string().email(),
                    password: z.string(),
                    phoneNumbers: z.array(phoneNumberSchema)
                });
                bodyParams = {
                    name: req.body.nome,
                    password: req.body.senha,
                    email: req.body.email,
                    phoneNumbers: req.body.telefones.map(function (phone) { return ({ number: phone.numero, ddd: phone.ddd, }); })
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                bodyParsed_1 = userSchema.parse(bodyParams);
                return [4 /*yield*/, prisma_1.prisma.user.findUnique({ where: { email: bodyParsed_1.email } })];
            case 2:
                userAlreadyExists = _a.sent();
                if (userAlreadyExists !== null) {
                    res.status(409).send({ "mensagem": "E-mail já existente" });
                }
                else {
                    bcrypt.genSalt(12, function (error, salt) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            bcrypt.hash(bodyParsed_1.password, salt, function (error, hashedPassword) { return __awaiter(void 0, void 0, void 0, function () {
                                var userCreated, payload, token;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, prisma_1.prisma.user.create({
                                                data: {
                                                    name: bodyParsed_1.name,
                                                    email: bodyParsed_1.email,
                                                    password: hashedPassword,
                                                    phoneNumbers: {
                                                        create: __spreadArray([], bodyParsed_1.phoneNumbers, true)
                                                    }
                                                }
                                            })];
                                        case 1:
                                            userCreated = _a.sent();
                                            payload = { id: userCreated.id, nome: userCreated.name };
                                            token = jwt.sign(payload, SECRET, { expiresIn: "1m" });
                                            res.send({
                                                id: userCreated.id,
                                                data_criacao: userCreated.createdAt,
                                                data_atualização: userCreated.updatedAt,
                                                ultimo_login: userCreated.lastLogin,
                                                token: token
                                            });
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            return [2 /*return*/];
                        });
                    }); });
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                res.status(400).send({ mensagem: "Parâmetros inválidos" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/signin', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var signInBodySchema, bodyParams, _a, email, password, user, isValidPassword, payload, token, data, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                signInBodySchema = z.object({ email: z.string().email(), password: z.string() });
                bodyParams = { email: req.body.email, password: req.body.senha };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                _a = signInBodySchema.parse(bodyParams), email = _a.email, password = _a.password;
                return [4 /*yield*/, prisma_1.prisma.user.findUnique({ where: { email: email } })];
            case 2:
                user = _b.sent();
                if (user == null) {
                    return [2 /*return*/, res.status(404).send({ mensagem: "Usuário e/ou senha inválidos" })];
                }
                return [4 /*yield*/, bcrypt.compare(password, user.password)];
            case 3:
                isValidPassword = _b.sent();
                if (!!isValidPassword) return [3 /*break*/, 4];
                return [2 /*return*/, res.status(401).send({ mensagem: "Usuário e/ou senha inválidos" })];
            case 4:
                payload = { id: user.id, nome: user.name };
                token = jwt.sign(payload, SECRET, { expiresIn: "1h" });
                return [4 /*yield*/, prisma_1.prisma.user.update({
                        where: {
                            id: user.id,
                        },
                        data: {
                            lastLogin: new Date(),
                        },
                    })];
            case 5:
                _b.sent();
                data = {
                    id: user.id,
                    data_criacao: user.createdAt,
                    data_atualização: user.updatedAt,
                    ultimo_login: user.lastLogin,
                    token: token
                };
                return [2 /*return*/, res.send(data)];
            case 6: return [3 /*break*/, 8];
            case 7:
                error_2 = _b.sent();
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
router.get('/user/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, bearerHeader, bearerToken;
    return __generator(this, function (_a) {
        id = req.params.id;
        bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader == 'undefined') {
            return [2 /*return*/, res.status(401).send({ "mensagem": "Não autorizado" })];
        }
        bearerToken = bearerHeader === null || bearerHeader === void 0 ? void 0 : bearerHeader.split(' ')[1];
        jwt.verify(bearerToken, SECRET, function (error, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!error) return [3 /*break*/, 1];
                        if (error.name == 'TokenExpiredError')
                            return [2 /*return*/, res.send(401).send({ "mensagem": "Sessão Inválida" })];
                        if (error.name == 'JsonWebTokenError')
                            return [2 /*return*/, res.send(401).send({ "mensagem": "Não autorizado" })];
                        else
                            res.send(401).send({ "mensagem": "Não autorizado" });
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, prisma_1.prisma.user.findUnique({ where: { id: id }, include: { phoneNumbers: true } })];
                    case 2:
                        user = _a.sent();
                        if (user == null)
                            res.send(401).send({ "mensagem": "Sessão Inválida" });
                        res.send({
                            nome: user.name, email: user.email,
                            data_criacao: user.createdAt,
                            data_atualizacao: user.updatedAt,
                            ultimo_login: user.lastLogin,
                            telefones: user === null || user === void 0 ? void 0 : user.phoneNumbers.map(function (phone) { return ({ "numero": phone.number, "ddd": phone.ddd }); })
                        });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
exports.default = router;
