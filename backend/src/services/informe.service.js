import { AppDataSource } from "../database/data-source.js"; // RUTA DE EJEMPLO
import { Informe } from "../models/Informe.js"; // RUTA DE EJEMPLO

export const informeRepository = AppDataSource.getRepository(Informe).extend({
  async getAll(options) {
    return this.find(options);
  },
  async create(data) {
    const newInforme = this.create(data);
    return this.save(newInforme);
  },
  async update(informe, data) {
    this.merge(informe, data);
    return this.save(informe);
  },
});
