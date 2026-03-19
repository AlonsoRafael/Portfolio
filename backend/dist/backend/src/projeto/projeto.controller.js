"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjetoController = void 0;
const common_1 = require("@nestjs/common");
const projeto_prisma_1 = require("./projeto.prisma");
const common_2 = require("@nestjs/common");
let ProjetoController = class ProjetoController {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async obterTodos() {
        return this.repo.obterTodos();
    }
    async obterPorId(id) {
        return this.repo.obterPorId(Number(id));
    }
};
exports.ProjetoController = ProjetoController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjetoController.prototype, "obterTodos", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjetoController.prototype, "obterPorId", null);
exports.ProjetoController = ProjetoController = __decorate([
    (0, common_1.Controller)('projetos'),
    __metadata("design:paramtypes", [projeto_prisma_1.ProjetoPrisma])
], ProjetoController);
//# sourceMappingURL=projeto.controller.js.map