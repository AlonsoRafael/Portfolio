"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TecnologiaModule = void 0;
const common_1 = require("@nestjs/common");
const tecnologia_controller_1 = require("./tecnologia.controller");
const tecnologia_prisma_1 = require("./tecnologia.prisma");
const db_module_1 = require("../db/db.module");
let TecnologiaModule = class TecnologiaModule {
};
exports.TecnologiaModule = TecnologiaModule;
exports.TecnologiaModule = TecnologiaModule = __decorate([
    (0, common_1.Module)({
        controllers: [tecnologia_controller_1.TecnologiaController],
        providers: [tecnologia_prisma_1.TecnologiaPrisma],
        imports: [db_module_1.DbModule],
    })
], TecnologiaModule);
//# sourceMappingURL=tecnologia.module.js.map