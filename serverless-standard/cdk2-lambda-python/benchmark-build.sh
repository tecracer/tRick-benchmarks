#!/bin/bash
# Script to compare build times between pip and uv

echo "===== CDK Lambda Build Time Comparison ====="
echo ""


echo "===== ************ ====="
echo "===== TypeScript 6 ====="
echo "===== ************ ====="
rm bin/cdk2-lambda-python.js
rm lib/cdk2-lambda-python-stack.js
cp tsconfig.json-ts6 tsconfig.json
cp cdk.json-ts6 cdk.json
cp bin/cdk2-lambda-python.ts-ts6 bin/cdk2-lambda-python.ts
cp package.json-ts6 package.json
npm i

echo "--- Default: Testing with pip  ---"
echo "Restoring  default..."
cp lambda-python/requirements.txt.default  lambda-python/requirements.txt
cp lambda-python/app.py.default  lambda-python/app.py

echo "Cleaning previous build artifacts..."
rm -rf cdk.out
rm -rf .venv
cp lib/cdk2-lambda-python-stack.ts.default lib/cdk2-lambda-python-stack.ts
time cdk synth > log.default.ts6.1.txt 2>&1
time cdk synth > log.default.ts6.2.txt 2>&1



echo ""
echo "--- Tuned: Testing with UV  ---"
echo "Restoring  tuned..."
cp lambda-python/requirements.txt.tuned  lambda-python/requirements.txt
cp lambda-python/app.py.tuned  lambda-python/app.py
cp lib/cdk2-lambda-python-stack.ts.tuned lib/cdk2-lambda-python-stack.ts
time cdk synth > log.tuned.ts6.1.txt 2>&1
time cdk synth > log.tuned.ts6.2.txt 2>&1
echo ""



echo "Cleaning previous build artifacts..."
rm -rf cdk.out
rm -rf .venv
echo "Restoring simple..."
cp lambda-python/requirements.txt.simple  lambda-python/requirements.txt
cp lambda-python/app.py.simple  lambda-python/app.py

echo "--- Simple: Testing with simple  ---"
cp lib/cdk2-lambda-python-stack.ts.simple lib/cdk2-lambda-python-stack.ts
time cdk synth > log.simple.ts6.1.txt 2>&1
time cdk synth > log.simple.ts6.2.txt 2>&1



echo "===== ************ ====="
echo "===== TypeScript 7 ====="
echo "===== ************ ====="
rm bin/cdk2-lambda-python.js
rm lib/cdk2-lambda-python-stack.js
cp tsconfig.json-ts7 tsconfig.json
cp cdk.json-ts7 cdk.json
cp package.json-ts7 package.json
cp bin/cdk2-lambda-python.ts-ts7 bin/cdk2-lambda-python.ts
npm i

echo "--- Default: Testing with pip  ---"
echo "Restoring  default..."
cp lambda-python/requirements.txt.default  lambda-python/requirements.txt
cp lambda-python/app.py.default  lambda-python/app.py

echo "Cleaning previous build artifacts..."
rm -rf cdk.out
rm -rf .venv
cp lib/cdk2-lambda-python-stack.ts.default lib/cdk2-lambda-python-stack.ts
time cdk synth > log.default.ts7.1.txt 2>&1
time cdk synth > log.default.ts7.2.txt 2>&1



echo ""
echo "--- Tuned: Testing with UV  ---"
echo "Restoring  tuned..."
cp lambda-python/requirements.txt.tuned  lambda-python/requirements.txt
cp lambda-python/app.py.tuned  lambda-python/app.py
cp lib/cdk2-lambda-python-stack.ts.tuned lib/cdk2-lambda-python-stack.ts
time cdk synth > log.tuned.ts7.1.txt 2>&1
time cdk synth > log.tuned.ts7.2.txt 2>&1
echo ""



echo "Cleaning previous build artifacts..."
rm -rf cdk.out
rm -rf .venv
rm bin/cdk2-lambda-python.js
rm lib/cdk2-lambda-python-stack.js
echo "Restoring simple..."
cp lambda-python/requirements.txt.simple  lambda-python/requirements.txt
cp lambda-python/app.py.simple  lambda-python/app.py

echo "--- Simple: Testing with simple  ---"
cp lib/cdk2-lambda-python-stack.ts.simple lib/cdk2-lambda-python-stack.ts
time cdk synth > log.simple.ts7.1.txt 2>&1
time cdk synth > log.simple.ts7.2.txt 2>&1

echo ""
echo "Build completed! Check the output above for timing."
echo ""


echo "Cleaning previous build artifacts..."
rm -rf cdk.out
rm -rf .venv
rm bin/cdk2-lambda-python.js
rm lib/cdk2-lambda-python-stack.js
echo "Restoring simple..."
cp lambda-python/requirements.txt.simple  lambda-python/requirements.txt
cp lambda-python/app.py.simple  lambda-python/app.py

echo "--- Simple: Testing with simple  ---"
cp lib/cdk2-lambda-python-stack.ts.simple lib/cdk2-lambda-python-stack.ts
time cdk synth > log.simple.ts7.1.txt 2>&1
time cdk synth > log.simple.ts7.2.txt 2>&1
