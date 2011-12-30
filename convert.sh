#!/bin/bash

TARGET_DIR="/home/damoun/iphone_app_photos"
DEST_DIR="img/photos"
notLast=0

initJSONFile()
{
    echo '[' > images.json
}

finitJSONFile()
{
    echo "" >> images.json
    echo ']' >> images.json
}

addToJSONFile()
{
    if [ "$notLast" == "1" ]
    then
	echo "," >> images.json
    fi
    notLast=1
    echo "  {" >> images.json
    echo "    \"name\": \"${1}\"," >> images.json
    echo "    \"width\": 138," >> images.json
    height=$(identify ${1} | awk '{print $4}' | sed 's/[^0-9]/ /g' | awk '{print $2}')
    echo "    \"height\": ${height}" >> images.json
    echo -n "  }" >> images.json
}

# remove ' '
rename 's/\s+/_/g' ${TARGET_DIR}/*
rename 's/\s+/_/g' ${TARGET_DIR}/*/*

mkdir -p ${DEST_DIR}

initJSONFile
idx=0
for f in $(find ${TARGET_DIR} -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.JPG" -o -iname "*.JPEG" -o -iname "*.PNG" \) )
do
    echo "${f} to ${DEST_DIR}/${idx}.jpg"
    convert "${f}" -resize 138x "${DEST_DIR}/${idx}.jpg"
    addToJSONFile "${DEST_DIR}/${idx}.jpg"
    idx=$(( ${idx} + 1 ))
done
finitJSONFile

exit 0