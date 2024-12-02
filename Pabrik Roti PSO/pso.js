import { Particle } from "./particle.js";

class PSO {
    constructor(n_Particles, n_Dimensi, obj_Function) {
        this.n_Particles = n_Particles;
        this.particles = [];
        this.n_Dimensi = n_Dimensi;
        this.obj_Function = obj_Function;
        this.gbestFitness = -Infinity; 
        this.gbestPosition = [];
        this.init_particles();
    }

    init_particles() {
        for (let i = 0; i < this.n_Particles; i++) {
            const particle = new Particle(this.n_Dimensi, this.obj_Function);
            particle.inisialisasiPosisi(0, 20); 
            this.particles.push(particle);
        }
    }

    evaluateFitness() {
        this.particles.forEach((particle) => particle.hitungFitness());
    }

    updatePbest() {
        this.particles.forEach((particle) => particle.updatePbest());
    }

    updateGbest() {
        this.particles.forEach((particle) => {
            if (particle.pbestFitness > this.gbestFitness) { 
                this.gbestFitness = particle.pbestFitness;
                this.gbestPosition = [...particle.pbest];
            }
        });
    }

    updateVelocity(c1 = 1, c2 = 1, w = 0.7) {
        this.particles.forEach((particle) => {
            for (let i = 0; i < this.n_Dimensi; i++) {
                const r1 = Math.random();
                const r2 = Math.random();
                particle.velocity[i] = 
                    w * particle.velocity[i] +
                    c1 * r1 * (particle.pbest[i] - particle.position[i]) +
                    c2 * r2 * (this.gbestPosition[i] - particle.position[i]);
            }
        });
    }

    updatePosition() {
        this.particles.forEach((particle) => particle.updatePosition());
    }

    mainPSO() {
        this.evaluateFitness();
        this.updatePbest();
        this.updateGbest();
        this.updateVelocity();
        this.updatePosition();
    }
}

export { PSO };