# Edusign Technical Test

## 👋 Welcome

You will be working on a signature validation application used by educational institutions. This application processes a large volume of data and must guarantee security and performance.

**Business context**: The application manages student signatures for attendance validation. It must process several thousand signatures per day with strict performance constraints.

---

## 🛠 Installation and startup

### Prerequisites
- Node.js 18+
- Docker and Docker Compose

### Setup
```bash
# Install dependencies
npm install

# Start the database
docker-compose up -d

# Run tests
npm test

# Development
npm run dev
```

---

## 📋 Exercises (60 minutes)

### 🔍 Exercise 1: Code Review & Architecture (20min)

The `src/app.ts` file contains an API that will be put into production to handle thousands of users.

**Your mission**:
- **Analyze the code** and identify critical issues
- **Prioritize corrections** by business impact
- **Propose a more robust** and secure architecture
- **Justify your technical** choices

**Points of attention**:
- Data security
- Performance and scalability
- Error handling
- Code architecture

### ⚡ Exercise 2: Algorithm optimization (25min)

The `src/algorithms/signature-detector.ts` file contains signature processing algorithms with performance issues.

**Your mission**:
- **Analyze the complexity** of current algorithms
- **Identify performance** bottlenecks
- **Optimize functions** to handle 10,000+ signatures
- **Measure the improvement** obtained

**Technical constraints**:
- Response time < 500ms for 1000 signatures
- Controlled memory consumption
- Maintain result accuracy

### 🤖 Exercise 3: AI-Assisted Development (15min)

Use AI to implement a feature for detecting artificially generated signatures.

**Your mission**:
- **Analyze the function** `detectAIGeneratedSignature` in `signature-detector.ts`
- **Use AI** (ChatGPT, Claude, etc.) to implement it
- **Test your solution** with the provided test cases
- **Document your AI usage** process

**Evaluation**:
- Quality of initial prompt
- Critique and improvement of AI responses
- Validation and testing of the solution

---

## 🎯 Expected deliverables

For each exercise:

1. **Source code** commented and functional
2. **Explanation** of your approach and identified issues
3. **Justification** of your technical choices
4. **Performance measurements** (exercise 2)
5. **Documentation** of your AI usage (exercise 3)

---

## 💡 Tips

- **Focus on logic**: we evaluate your reasoning
- **Prioritize critical impacts**: security > performance > maintainability
- **Document your approach**: explain the "why" of your decisions
- **Use AI intelligently**: as a helping tool, not a miracle solution
- **Ask questions** if requirements are not clear

---

## ⏰ Time management (60 minutes)

- **Exercise 1**: 20 minutes - Focus on critical issues
- **Exercise 2**: 25 minutes - Measurable optimization
- **Exercise 3**: 15 minutes - AI-guided implementation

If you run out of time, **document your approach** and next steps.

**The goal is to evaluate your technical reasoning and efficiency.**

---

## 🤝 Support

Feel free to ask for:
- Clarifications on functional requirements
- Technical help with the environment
- Clarifications on expectations

**Good luck! 🚀** 