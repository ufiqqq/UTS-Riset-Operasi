import { Particle } from "./particle.js";

class Dragonfly {
    constructor(n_Particles, n_Dimensi, obj_Function) {
        this.n_Particles = n_Particles;
        this.n_Dimensi = n_Dimensi;
        this.obj_Function = obj_Function;
        this.particles = [];
        this.gbestFitness = -Infinity;
        this.gbestPosition = [];
        this.sFactor = 0.1; // Separation weight
        this.aFactor = 0.1; // Alignment weight
        this.cFactor = 0.1; // Cohesion weight
        this.fFactor = 1;   // Food attraction weight
        this.eFactor = 1;   // Enemy distraction weight
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

    updateGbest() {
        this.particles.forEach((particle) => {
            if (particle.fitness > this.gbestFitness) { 
                this.gbestFitness = particle.fitness;
                this.gbestPosition = [...particle.position];
            }
        });
    }

    calculateForces() {
        const separation = Array(this.n_Dimensi).fill(0);
        const alignment = Array(this.n_Dimensi).fill(0);
        const cohesion = Array(this.n_Dimensi).fill(0);

        this.particles.forEach((particle, idx) => {
            for (let otherIdx = 0; otherIdx < this.n_Particles; otherIdx++) {
                if (idx === otherIdx) continue;
                const other = this.particles[otherIdx];

                const distance = particle.position.map((p, i) => other.position[i] - p);
                const magnitude = Math.sqrt(distance.reduce((sum, d) => sum + d ** 2, 0));

                // Separation (avoid collision)
                if (magnitude > 0) {
                    const sepForce = distance.map(d => -d / magnitude ** 2);
                    separation.forEach((s, i) => (separation[i] += sepForce[i]));
                }

                // Alignment (match velocity)
                alignment.forEach((a, i) => (alignment[i] += other.velocity[i]));

                // Cohesion (move towards center)
                cohesion.forEach((c, i) => (cohesion[i] += other.position[i] - particle.position[i]));
            }

            // Normalize alignment and cohesion
            alignment.forEach((a, i) => (alignment[i] /= this.n_Particles - 1));
            cohesion.forEach((c, i) => (cohesion[i] /= this.n_Particles - 1));

            // Update velocity with forces
            particle.velocity = particle.velocity.map((v, i) =>
                v +
                this.sFactor * separation[i] +
                this.aFactor * alignment[i] +
                this.cFactor * cohesion[i] +
                this.fFactor * (this.gbestPosition[i] - particle.position[i]) -
                this.eFactor * (particle.position[i] - particle.pbest[i])
            );
        });
    }

    updatePosition() {
        this.particles.forEach((particle) => {
            for (let i = 0; i < this.n_Dimensi; i++) {
                particle.position[i] += particle.velocity[i];
                particle.position[i] = Math.max(0, Math.floor(particle.position[i])); 
            }
        });
    }

    mainDA() {
        this.evaluateFitness();
        this.updateGbest();
        this.calculateForces();
        this.updatePosition();
    }
}

export { Dragonfly };
