"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjetoModule = void 0;
const common_1 = require("@nestjs/common");
const projeto_prisma_1 = require("./projeto.prisma");
const projeto_controller_1 = require("./projeto.controller");
const db_module_1 = require("../db/db.module");
let ProjetoModule = class ProjetoModule {
};
exports.ProjetoModule = ProjetoModule;
exports.ProjetoModule = ProjetoModule = __decorate([
    (0, common_1.Module)({
        providers: [projeto_prisma_1.ProjetoPrisma],
        controllers: [projeto_controller_1.ProjetoController],
        imports: [db_module_1.DbModule],
    })
], ProjetoModule);
//# sourceMappingURL=projeto.module.js.map