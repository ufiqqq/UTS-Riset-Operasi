class Particle {
    constructor(nDimensi, objFunction) {
        this.objFunction = objFunction;
        this.nDimensi = nDimensi;
        this.position = Array(nDimensi).fill(0);
        this.velocity = Array(nDimensi).fill(0);
        this.pbest = Array(nDimensi).fill(0);
        this.pbestFitness = 0;
        this.fitness = Infinity;
    }

    inisialisasiPosisi(min, max) {
        for (let i = 0; i < this.nDimensi; i++) {
            this.position[i] = Math.floor(Math.random() * (max - min) + min); 
            this.velocity[i] = 0;
            this.pbest[i] = this.position[i];
        }
    }

    hitungFitness() {
        this.fitness = this.objFunction(...this.position);
    }

    updatePbest() {
        if (this.fitness > this.pbestFitness) {
            this.pbestFitness = this.fitness;
            this.pbest = [...this.position];
        }
    }

    updatePosition() {
        for (let i = 0; i < this.nDimensi; i++) {
            this.position[i] += this.velocity[i];
            this.position[i] = Math.max(0, Math.floor(this.position[i])); 
        }
    }
}

export { Particle };