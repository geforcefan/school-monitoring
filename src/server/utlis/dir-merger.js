import dircompare from 'dir-compare';
import mkdirp from 'mkdirp';
import path from 'path';
import fse from 'node-fs-extra';

export default function (targetDir, destinationDir) {
    return new Promise(resolve => {
        mkdirp(destinationDir);

        const res = dircompare.compareSync(targetDir, destinationDir, { compareSize: true });

        res.diffSet.filter(entry => entry.state === "right")
            .forEach(entry => {
                // Datei existiert im source nicht mehr, löschen im destination!
                if(entry.type1 === "missing") {
                    const absolutePath2 = path.join(entry.path2, entry.name2);

                    fse.removeSync(absolutePath2);
                }
            });

        res.diffSet.filter(entry => entry.state === "left")
            .forEach(entry => {
                // datei/ordner existiert auf dem ziel nicht
                if (entry.type2 === "missing") {
                    const absolutePath1 = path.join(entry.path1, entry.name1);
                    const relativePath = absolutePath1.replace(targetDir, "");
                    const absolutePath2 = path.join(destinationDir, relativePath);

                    if (entry.type1 === "directory") {
                        fse.removeSync(absolutePath2);
                        mkdirp(absolutePath2);
                    }

                    if (entry.type1 === "file") {
                        fse.removeSync(absolutePath2);
                        fse.copySync(absolutePath1, absolutePath2);
                    }
                }
        });

        res.diffSet.filter(entry => entry.state === "distinct")
            .forEach(entry => {
                // Datei ist modifziert, kopieren
                if(entry.type2 === "file") {
                    const absolutePath1 = path.join(entry.path1, entry.name1);
                    const relativePath = absolutePath1.replace(targetDir, "");
                    const absolutePath2 = path.join(destinationDir, relativePath);

                    fse.copySync(absolutePath1, absolutePath2);
                }
            });

        fse.removeSync(targetDir);

        resolve(destinationDir);
    })
}