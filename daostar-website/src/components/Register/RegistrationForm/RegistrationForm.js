import React, { Fragment, useEffect, useState } from "react";
import validator from "validator";
import useAxios from "axios-hooks";
import {
  Button,
  Callout,
  Divider,
  FormGroup,
  HTMLSelect,
  InputGroup,
  Switch,
  Dialog,
  DialogBody,
  DialogFooter,
  AnchorButton,
  Icon,
} from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import FRAMEWORK_URIs from "./FRAMEWORK_URIs";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useSigner } from "../../../utils/wagmi-utils";
import { useAccount, useNetwork, useContractRead } from "wagmi";
import { ethers } from "ethers";
import RegistrationContract from "../../../abi/EASRegistrationContract";

const networkIds = {
  mainnet: 1,
  optimismSepolia: 11155420,
  // sepolia: 11155111
  chapel: 97,
  optimism: 10,
  arbitrum: 42161,
};

const RegistrationForm = ({ toggleRegScreen, setRegistrationData }) => {
  const { address, isConnected } = useAccount();
  const signer = useSigner();
  const { chain } = useNetwork();
  const [showEASRegisterDialog, setShowEASRegisterDialog] = useState(false);
  const [attestationUID, setAttestationUID] = useState(null)
  const [attestationURL, setAttestationURL] = useState("");
  const [attestationScanURL, setAttestationScanURL] = useState("");

  const [easNetworkID, setEasNetworkID] = useState(1);
  const onChangeEASNetworkID = (e) => {
    const networkID = parseInt(e.target.value, 10);

    setEasNetworkID(networkID);
  };

  const [daoContractNetwork, setDaoContractNetwork] = useState("mainnet");
  const onChangeDaoContractNetwork = (e) => {
    setDaoContractNetwork(e.target.value);
    const networkName = e.target.value;
    setDaoContractNetwork(networkName);

    const framework = daoFramework;
    const address = daoContractAddress.toLowerCase();
    const networkId = networkIds[networkName];

    // if the user chooses a DAO framework, default the URIs to framework-specific values
    if (FRAMEWORK_URIs[framework] && address && networkId) {
      const frameworkSettings = FRAMEWORK_URIs[framework];
      if (frameworkSettings) {
        if (frameworkSettings.membersURI) {
          setDaoMembersURI(
            FRAMEWORK_URIs[framework].membersURI(address, networkId)
          );
        }
        if (frameworkSettings.proposalsURI) {
          setDaoProposalsURI(
            FRAMEWORK_URIs[framework].proposalsURI(address, networkId)
          );
        }
      }
    } else {
      setDaoMembersURI("");
      setDaoProposalsURI("");
    }
  };

  const [daoContractAddress, setDaoContractAddress] = useState("");
  const onChangeDaoContractAddress = (e) => {
    const address = e.target.value;
    setDaoContractAddress(address);

    const framework = daoFramework;
    const networkName = daoContractNetwork;
    const networkId = networkIds[networkName];

    // if the user chooses a DAO framework, default the URIs to framework-specific values
    if (FRAMEWORK_URIs[framework] && address && networkId) {
      const frameworkSettings = FRAMEWORK_URIs[framework];
      if (frameworkSettings) {
        if (frameworkSettings.membersURI) {
          setDaoMembersURI(
            FRAMEWORK_URIs[framework].membersURI(address, networkId)
          );
        }
        if (frameworkSettings.proposalsURI) {
          setDaoProposalsURI(
            FRAMEWORK_URIs[framework].proposalsURI(address, networkId)
          );
        }
      }
    } else {
      setDaoMembersURI("");
      setDaoProposalsURI("");
    }
  };

  const [registerByEAS, setRegisterByEAS] = useState(false);
  const onChangeRegisterType = (e) => {
    setErrors(null);
    setRegisterByEAS(!registerByEAS);
  };

  const [daoName, setDaoName] = useState("");
  const onChangeDaoName = (e) => setDaoName(e.target.value);

  const [daoURI, setDaoURI] = useState("");
  const onChangeDAOURI = (e) => setDaoURI(e.target.value);

  const [daoDescription, setDaoDescription] = useState("");
  const onChangeDaoDescription = (e) => setDaoDescription(e.target.value);

  const [daoMembersURI, setDaoMembersURI] = useState("");
  const onChangeMembersURI = (e) => setDaoMembersURI(e.target.value);

  const [contractAddress, setContractAddress] = useState("");
  const onChangeContractAddress = (e) => setContractAddress(e.target.value);

  const [issuerName, setIssuerName] = useState("");
  const onChangeIssuerName = (e) => setIssuerName(e.target.value);

  const [issuerDescription, setIssuerDescription] = useState("");
  const onChangeIssuerDescription = (e) => setIssuerDescription(e.target.value);

  const [daoIssuersURI, setDaoIssuersURI] = useState("");
  const onChangeIssuersURI = (e) => setDaoIssuersURI(e.target.value);

  const [daoActivityURI, setDaoActivityURI] = useState("");
  const onChangeActivityURI = (e) => setDaoActivityURI(e.target.value);

  const [daoProposalsURI, setDaoProposalsURI] = useState("");
  const onChangeProposalsURI = (e) => setDaoProposalsURI(e.target.value);

  const [daoContractsRegistryURI, setDaoContractsRegistryURI] = useState("");
  const onChangeContractsRegistryURI = (e) =>
    setDaoContractsRegistryURI(e.target.value);

  const [daoManagerAddress, setDaoManagerAddress] = useState("");
  const onChangeDaoManager = (e) => setDaoManagerAddress(e.target.value);

  const [daoGovURI, setDaoGovURI] = useState("");
  const onChangeDaoGovURI = (e) => setDaoGovURI(e.target.value);

  const [daoFramework, setDaoFramework] = useState("custom");
  const onChangeDaoFramework = (e) => {
    const framework = e.target.value;
    const address = daoContractAddress.toLowerCase();
    const networkName = daoContractNetwork;
    const networkId = networkIds[networkName];

    setDaoFramework(framework);
    // if the user chooses a DAO framework, default the URIs to framework-specific values
    if (FRAMEWORK_URIs[framework] && address && networkId) {
      const frameworkSettings = FRAMEWORK_URIs[framework];
      if (frameworkSettings) {
        if (frameworkSettings.membersURI) {
          setDaoMembersURI(
            FRAMEWORK_URIs[framework].membersURI(address, networkId)
          );
        }
        if (frameworkSettings.proposalsURI) {
          setDaoProposalsURI(
            FRAMEWORK_URIs[framework].proposalsURI(address, networkId)
          );
        }
      }
    } else {
      setDaoMembersURI("");
      setDaoProposalsURI("");
    }
  };

  const [registrationError, setRegError] = useState(null);

  const [validationErrors, setErrors] = useState(null);

  const [registerLoading, setRegisterLoading] = useState(false);

  const [
    {
      data: registeredData,
      loading: sendingRegistration,
      error: registerError,
    },
    executeRegistration,
  ] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/immutable`,
      method: "POST",
    },
    { manual: true }
  );

  // display an error if the server responds with an error
  useEffect(() => {
    if (registerError) {
      switch (registerError.response.status) {
        case 409:
          setRegError(`That DAO has already been registered`);
          break;
        default:
          setRegError(`Something's not right – try again later`);
      }
    }
  }, [registerError]);

  const onRegister = () => {
    let errors = [];
    if (daoFramework === "snapshot") {
      if (!daoContractAddress.includes(".eth"))
        errors.push("Must be valid ENS name");
    } else {
      if (
        !validator.isEthereumAddress(daoContractAddress) &&
        daoFramework !== "custom"
      )
        errors.push("Contract address must be a valid ethereum address");
    }
    if (daoName === "") errors.push(`DAO must have a name`);
    if (daoManagerAddress && !validator.isEthereumAddress(daoManagerAddress))
      errors.push("Manager address must be a valid ethereum address");
    if (daoGovURI !== "" && !validator.isURL(daoGovURI))
      errors.push("Governance URI must be a valid URI");
    if (daoMembersURI !== "" && !validator.isURL(daoMembersURI))
      errors.push(`Members URI must be a valid URI`);
    if (daoActivityURI !== "" && !validator.isURL(daoActivityURI))
      errors.push(`Activity Log URI must be a valid URI`);
    if (daoProposalsURI !== "" && !validator.isURL(daoProposalsURI))
      errors.push(`Proposals URI must be a valid URI`);
    if (
      daoContractsRegistryURI !== "" &&
      !validator.isURL(daoContractsRegistryURI)
    )
      errors.push(`Contracts Registry URI must be a valid URI`);
    if (daoIssuersURI !== "" && !validator.isURL(daoIssuersURI))
      errors.push(`Issuer URI must be a valid URI`);

    if (errors.length > 0) {
      setErrors(errors);
      window.scrollTo(0, 0);
    }
    if (errors.length === 0) {
      let registrationData = {
        data: {
          name: daoName,
          description: daoDescription,
          governanceURI: daoGovURI,
          membersURI: daoMembersURI,
          proposalsURI: daoProposalsURI,
          activityLogURI: daoActivityURI,
          contractsRegistryURI: daoContractsRegistryURI,
          managerAddress: daoManagerAddress,
          issuersURI: daoIssuersURI,
        },
      };
      executeRegistration({
        data: registrationData,
      }).then((response) => {
        setRegistrationData({
          daoURI: response.data.url,
          daoContractAddress: daoContractAddress,
          daoContractNetwork: daoContractNetwork,
          daoName: daoName,
          daoDescription: daoDescription,
          managerAddress: daoManagerAddress,
          governanceURI: daoGovURI,
          membersURI: daoMembersURI,
          proposalsURI: daoProposalsURI,
          activityLogURI: daoActivityURI,
          contractsRegistryURI: daoContractsRegistryURI,
          issuersURI: daoIssuersURI,
        });
        toggleRegScreen("REG_RECEIVED");
      });
    }
  };

  function validateField(spec) {
    const { name, value, validator, errorMessage, type } = spec;

    // Handling undefined or empty values
    if (value === undefined || value === "") {
      return errorMessage || `Empty value for field "${name}"`;
    }

    // Directly using validator for specific checks
    if (validator && !validator(value)) {
      return errorMessage || `Invalid value for field "${name}"`;
    }

    if (type === "uint256" && (!Number.isInteger(value) || value < 0)) {
      return `Invalid type for field "${name}". Expected uint256, got ${typeof value} got ${value}`;
    }
    if (type === "string" && typeof value !== "string") {
      return `Invalid type for field "${name}". Expected string, got ${typeof value}`;
    }

    return null;
  }

  function validateAll(fields) {
    const errors = fields.map(validateField).filter((error) => error !== null);
    return errors;
  }

  const onRegisterByEAS = async () => {
    let validationErrors = [];
    // Clear errors when the user is about to correct the issue or retry
    setErrors([]);

    if (!isConnected || !chain) {
      validationErrors.push(
        `Please connect your wallet and ensure chain information is available.`
      );
      setErrors(validationErrors);
      window.scrollTo(0, 0);
      return;
    }

    // Setting Environment based on chain ID
    let easscanURL =
      chain.id === 11155420
        ? "https://optimism-sepolia.easscan.org/schema/view"
        : "https://optimism.easscan.org/schema/view";

    let easscanAttestationURL =
      chain.id === 11155420
        ? "https://optimism-sepolia.easscan.org/attestation/view"
        : "https://optimism.easscan.org/attestation/view";
    let schemaUid =
      chain.id === 11155420
        ? "0x306fda1c3128d08699d4c5b4e3f397fa31c8f5927b0e751f40f45ee1273ac504"
        : "0x1b1837dfb994702896d5d19bb0d66cf16ea30d8523765b938ec029088f90f904";
    let registrationContract =
      chain.id === 11155420
        ? "0xF124Aca94e664Bfd5373feA9E2410FD799a8a08B"
        : "0xb35AA0cB89eC35f04c30E19B736b8ae1904EC26b";

    const fields = [
      {
        name: "networkID",
        value: easNetworkID,
        type: "uint256",
        errorMessage: "Network ID of Contract Address must be provided",
      },
      {
        name: "daoName",
        value: daoName,
        type: "string",
        errorMessage: "DAO must have a name",
      },
      {
        name: "daoURI",
        value: daoURI,
        type: "string",
        validator: validator.isURL,
        errorMessage: "DAO URI must be a valid URI",
      },
      {
        name: "contractAddress",
        value: contractAddress,
        validator: validator.isEthereumAddress,
        type: "address",
        errorMessage: "Contract address must be a valid Ethereum address",
      },
      {
        name: "issuerName",
        value: issuerName,
        type: "string",
        errorMessage: "Issuer name must be provided",
      },
      {
        name: "issuerDescription",
        value: issuerDescription,
        type: "string",
        errorMessage: "Issuer description must be provided",
      },
    ];

    validationErrors = validateAll(fields);

    if (!isConnected)
      validationErrors.push(`Please connect your wallet to Optimism Mainnet`);
    if (!(chain.id === 10 || chain.id === 11155420)) {
      validationErrors.push(`Switch to Optimism Mainnet on your connected wallet`);
    }
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      window.scrollTo(0, 0);
      return;
    }
    if (validationErrors.length === 0) {
      setErrors(null);
    }

    const data = fields.map(({ name, value, type }) => ({ name, value, type }));

    let encodedData;
    try {
      const schemaEncoder = new SchemaEncoder(
        "uint256 networkID,string daoName,string daoURI,address contractAddress,string issuerName,string issuerDescription"
      );
      encodedData = schemaEncoder.encodeData(data);
    } catch (error) {
      console.error(`Data encoding error: ${error.message}`);
      setErrors([`Data encoding error: ${error.message}`]);
      return;
    }

    setRegisterLoading(true);

    try {
      // Checking authority
      const contract = new ethers.Contract(
        registrationContract,
        RegistrationContract,
        signer
      );
      const memberRole = await contract.MEMBER_ROLE();
      const isMember = await contract.hasRole(memberRole, address);

      if (!isMember) throw new Error(`You have no authorization. Request authorization to get added to the schema allowlist`);

      const eas = new EAS("0x4200000000000000000000000000000000000021");
      eas.connect(signer);

      // Performing attestation
      const attestationTx = await eas.attest({
        schema: schemaUid,
        data: {
          recipient: address,
          expirationTime: 0,
          revocable: true,
          refUID:
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          data: encodedData,
          value: 0,
        },
      });

      // Get new attestation UID

      const newAttestationUID = await attestationTx.wait();

      if (newAttestationUID) {
        setAttestationURL(`${easscanURL}/${schemaUid}`);
        setAttestationScanURL(`${easscanAttestationURL}/${newAttestationUID}`)
        setAttestationUID(newAttestationUID)
        setShowEASRegisterDialog(true);
      }


    } catch (e) {
      console.error("Attest error:", e);
      setErrors([`${e.message || e.toString()}`]);
    } finally {
      setRegisterLoading(false);
    }
  };

  const onHandleCloseEASRegisterDialog = () => {
    setShowEASRegisterDialog(false);
  };



  const EthNetworksSelect = (
    <>
      <HTMLSelect
        style={{ minWidth: 140 }}
        iconProps={{ icon: "caret-down", color: "#fff" }}
        value={daoContractNetwork}
        onChange={onChangeDaoContractNetwork}
        options={[
          { label: "Mainnet", value: "mainnet" },
          { label: "Optimism", value: "optimism" },
          { label: "Optimism Sepolia", value: "optimismSepolia" },
          { label: "Arbitrum", value: "arbitrum" },
          { label: "BNB Bruno", value: "chapel" },
        ]}
      />
    </>
  );

  const FrameworkSelect = (
    <HTMLSelect
      id="framework"
      fill
      iconProps={{ icon: "caret-down", color: "#fff" }}
      onChange={onChangeDaoFramework}
      placeholder="Select framework"
      options={[
        { label: "Custom", value: "custom" },
        { label: "Moloch", value: "molochv2" },
        { label: "Safe", value: "safe" },
        { label: "DAODAO", value: "daodao" },
        { label: "Snapshot", value: "snapshot" },
      ]}
    />
  );

  const errorCallout = validationErrors ? (
    <Callout intent="danger">
      <p>Please address the following issues:</p>
      <ul>
        {validationErrors.map((error, i) => {
          return <li key={i}>{error}</li>;
        })}
      </ul>
    </Callout>
  ) : null;

  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          paddingRight: "20px",
        }}
      >
        <h3>Register your DAO</h3>
        <Switch
          checked={registerByEAS}
          alignIndicator={"right"}
          labelElement={<label>Register through EAS</label>}
          large
          onChange={onChangeRegisterType}
        />
      </div>
      {validationErrors && (
        <Fragment>
          <Divider vertical />
          <div className="card-metadata">{errorCallout}</div>
        </Fragment>
      )}
      <Divider vertical={true} />

      {!registerByEAS && (
        <div style={{ width: "100%" }}>
          <div className="wizard-row wizard-row-flex">
            <FormGroup
              label={
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} >
                  Contract address
                  <Tooltip2 content={"DAO Contract Address or ENS name"}>
                    <Icon icon="info-sign" size={12} style={{ paddingBottom: '2px' }} />
                  </Tooltip2>
                </div>
              }
            >
              {EthNetworksSelect}
            </FormGroup>
            <InputGroup
              fill
              placeholder="Enter DAO address or id (eg ENS for snapshot)"
              value={daoContractAddress}
              onChange={onChangeDaoContractAddress}
              disabled={daoFramework !== "custom" ? false : true}
            />
          </div>
          <div className="wizard-row">
            <FormGroup label="Name" labelFor="name" fill>
              <InputGroup
                fill
                id="name"
                placeholder="Enter DAO name"
                value={daoName}
                onChange={onChangeDaoName}
              />
            </FormGroup>
          </div>
          <div className="wizard-row">
            <FormGroup label="Description" labelFor="description" fill>
              <InputGroup
                fill
                id="description"
                placeholder="Enter DAO description"
                value={daoDescription}
                onChange={onChangeDaoDescription}
              />
            </FormGroup>
          </div>
          <div className="wizard-row">
            <FormGroup label={
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} >
                Framework
                <Tooltip2 content={"DAO Governance Framework"}>
                  <Icon icon="info-sign" size={12} style={{ paddingBottom: '3px' }} />
                </Tooltip2>
              </div>
            } labelFor="framework" fill>
              {FrameworkSelect}
            </FormGroup>
          </div>
          <div className="wizard-row">
            <Divider />
          </div>
          <div>
            <div className="wizard-row">
              <FormGroup label={
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} >
                  Members URI
                  <Tooltip2 content={"Information about the members of DAO"}>
                    <Icon icon="info-sign" size={12} style={{ paddingBottom: '3px' }} />
                  </Tooltip2>
                </div>
              } labelFor="members-uri" fill>
                <InputGroup
                  fill
                  id="members-uri"
                  value={daoMembersURI}
                  placeholder="Enter URI to members"
                  onChange={onChangeMembersURI}
                />
              </FormGroup>
            </div>
            <div className="wizard-row">
              <FormGroup
                label={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} >
                    Activity Log URI
                    <Tooltip2 content={"Information about general DAO governance activity and discussions"}
                      position="auto">
                      <Icon icon="info-sign" size={12} style={{ paddingBottom: '3px' }} />
                    </Tooltip2>
                  </div>
                }
                labelFor="activity-log-uri"
                fill
              >
                <InputGroup
                  fill
                  id="activity-log-uri"
                  placeholder="Enter URI to activity log"
                  value={daoActivityURI}
                  onChange={onChangeActivityURI}
                />
              </FormGroup>
            </div>
            <div className="wizard-row">
              <FormGroup label={
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} >
                  Proposals URI
                  <Tooltip2 content={"Information on DAO proposals and their status"}>
                    <Icon icon="info-sign" size={12} style={{ paddingBottom: '3px' }} />
                  </Tooltip2>
                </div>
              } labelFor="proposals-uri" fill>
                <InputGroup
                  fill
                  id="proposals-uri"
                  placeholder="Enter URI to proposals"
                  value={daoProposalsURI}
                  onChange={onChangeProposalsURI}
                />
              </FormGroup>
            </div>
            <div className="wizard-row">
              <FormGroup label={
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} >
                  Issuers URI
                  <Tooltip2 content={"Information about the Issuer of the DAO URI"}>
                    <Icon icon="info-sign" size={12} style={{ paddingBottom: '3px' }} />
                  </Tooltip2>
                </div>
              } labelFor="proposals-uri" fill>
                <InputGroup
                  fill
                  id="issuer-uri"
                  placeholder="Enter URI for Issuers"
                  value={daoIssuersURI}
                  onChange={onChangeIssuersURI}
                />
              </FormGroup>
            </div>
            <div className="wizard-row">
              <FormGroup
                label={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} >
                    Contract registry URI (optional)
                    <Tooltip2 content={"Information about all the DAO and treasury contracts"}>
                      <Icon icon="info-sign" size={12} style={{ paddingBottom: '3px' }} />
                    </Tooltip2>
                  </div>
                }
                labelFor="contracts-registry-uri"
                fill
              >
                <InputGroup
                  fill
                  id="contracts-registry-uri"
                  placeholder="Enter URI to contracts registry"
                  value={daoContractsRegistryURI}
                  onChange={onChangeContractsRegistryURI}
                />
              </FormGroup>
            </div>
          </div>
          <div className="wizard-row">
            <FormGroup
              label="Manager address (optional)"
              labelFor="manager-address"
              fill
            >
              <InputGroup
                fill
                id="manager-address"
                placeholder="Enter address of DAO manager"
                value={daoManagerAddress}
                onChange={onChangeDaoManager}
              />
            </FormGroup>
          </div>
          <div className="wizard-row">
            <FormGroup
              label="Governance document (optional)"
              labelFor="governance-document"
              fill
            >
              <InputGroup
                fill
                id="governance-document"
                placeholder="Enter URI to governance document (.md)"
                value={daoGovURI}
                onChange={onChangeDaoGovURI}
              />
            </FormGroup>
          </div>
          <Divider vertical={true} />
          {registrationError && (
            <div className="wizard-row wizard-center">
              <Callout intent="danger">{registrationError}</Callout>
            </div>
          )}
          <div className="wizard-row wizard-center">
            <Button
              intent="primary"
              text="Register"
              loading={sendingRegistration}
              onClick={onRegister}
            />
            <br />
            <p className="bp4-text-small wizard-no-margin">
              Registering will generate a DAO URI
            </p>
          </div>
        </div>
      )}
      {registerByEAS && !showEASRegisterDialog && (
        <div style={{ width: "100%" }}>
          <div className="wizard-row wizard-row-flex">
            <FormGroup label={
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} >
                DAO Network ID
                <Tooltip2 content={"Network on which DAO's governance contract/main treasury exists"}>
                  <Icon icon="info-sign" size={12} style={{ paddingBottom: '2px' }} />
                </Tooltip2>
              </div>
            }>
              <HTMLSelect
                style={{ minWidth: 140 }}
                iconProps={{ icon: "caret-down", color: "#fff" }}
                value={easNetworkID}
                onChange={onChangeEASNetworkID}
                options={[
                  { label: "Ethereum", value: 1 },
                  { label: "Optimism", value: 10 },
                  { label: "Arbitrum", value: 42161 },
                  { label: "Avalanche", value: 43114 },
                  { label: "BNB", value: 56 },
                  { label: "Polygon", value: 137 },
                ]}
              />
            </FormGroup>
          </div>
          <div className="wizard-row">
            <FormGroup label="DAO Name" labelFor="dao-name" fill>
              <InputGroup
                fill
                id="dao-name"
                placeholder="Enter DAO name"
                value={daoName}
                onChange={onChangeDaoName}
              />
            </FormGroup>
          </div>
          <div className="wizard-row">
            <FormGroup label={
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} >
                DAO URI
                <Tooltip2 content={"URI compliant with EIP-4824. You can use daostar.org/register to create a daoURI"}>
                  <Icon icon="info-sign" size={12} style={{ paddingBottom: '2px' }} />
                </Tooltip2>
              </div>
            } labelFor="dao-uri" fill>
              <InputGroup
                fill
                id="dao-uri"
                value={daoURI}
                placeholder="Enter DAO URI"
                onChange={onChangeDAOURI}
              />
            </FormGroup>
          </div>
          <div className="wizard-row">
            <FormGroup
              label={
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} >
                  DAO Contract Address
                  <Tooltip2 content={"DAO's governance/main treasury contract address"}>
                    <Icon icon="info-sign" size={12} style={{ paddingBottom: '2px' }} />
                  </Tooltip2>
                </div>
              }
              labelFor="contract-address"
              fill
            >
              <InputGroup
                fill
                id="contract-address"
                value={contractAddress}
                placeholder="Enter Contract Address"
                onChange={onChangeContractAddress}
              />
            </FormGroup>
          </div>
          <div className="wizard-row">
            <FormGroup label={
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} >
                Issuer Name
                <Tooltip2 content={"Attestation issuer name"}>
                  <Icon icon="info-sign" size={12} style={{ paddingBottom: '2px' }} />
                </Tooltip2>
              </div>
            } labelFor="issuer-name" fill>
              <InputGroup
                fill
                id="issuer-name"
                value={issuerName}
                placeholder="Enter Issuer Name"
                onChange={onChangeIssuerName}
              />
            </FormGroup>
          </div>
          <div className="wizard-row">
            <FormGroup
              label={
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} >
                  Issuer Description
                  <Tooltip2 content={"Attestation issuer description"}>
                    <Icon icon="info-sign" size={12} style={{ paddingBottom: '2px' }} />
                  </Tooltip2>
                </div>
              }
              labelFor="issuer-description"
              fill
            >
              <InputGroup
                fill
                id="issuer-description"
                value={issuerDescription}
                placeholder="Enter Issuer Description"
                onChange={onChangeIssuerDescription}
              />
            </FormGroup>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "40px 24px",
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column', // Default to column layout
                gap: '8px', // Add gap between buttons
              }}
            >
              <AnchorButton
                href="https://docs.daostar.org/How%20To's/DifferentPaths#3-eas-attestations"
                target="_blank"
                icon="link"
                text="Get More Details"
                small={true}
                fill={false}
              />
              <AnchorButton
                href="https://forms.gle/d8nGkfKbpnbPJa8J6"
                target="_blank"
                icon="link"
                text="Request Authorization"
                small={true}
                fill={false}
              />
            </div>
            <Button
              intent="primary"
              style={{ padding: "20px 40px" }}
              text="Register"
              loading={registerLoading}
              onClick={onRegisterByEAS}
            />
          </div>
        </div>
      )}
      {registerByEAS && showEASRegisterDialog && (
        <div style={{ width: "100%" }}>
          <div
            style={{
              margin: "40px 24px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <p style={{ fontSize: "15px" }}>
              <strong>Congratulations, DAO registered.</strong>
            </p>
          </div>
          <div
            style={{
              margin: "60px 24px",
              display: "flex",
              justifyContent: "center",
              gap: "12px"
            }}
          >
            <AnchorButton
              intent="primary"
              href={attestationURL}
              target="_blank"
              icon="share"
              fill={false}
            >
              View Schema
            </AnchorButton>
            <AnchorButton
              intent="primary"
              href={attestationScanURL}
              target="_blank"
              icon="share"
              fill={false}
            >
              View Attestation
            </AnchorButton>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default RegistrationForm;
